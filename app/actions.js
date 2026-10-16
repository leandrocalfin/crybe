"use server";

import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { ipDeHeaders } from "../lib/ip";

// --- Validación estricta compartida (servidor = fuente de verdad) ---
const MOTIVOS = [
  "Consulta clínica general / Especialidades",
  "Alquiler de consultorios / Módulos",
  "Quiero formar parte del equipo",
  "Turnos y horarios",
];

const ContactoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Nombre muy corto")
    .max(80, "Nombre muy largo")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü'’\-.\s]+$/, "Nombre inválido"),
  telefono: z
    .string()
    .trim()
    .min(6, "Teléfono muy corto")
    .max(25, "Teléfono muy largo")
    .regex(/^[+0-9() \-]{6,25}$/, "Teléfono inválido"),
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.string().email("Email inválido").max(160).optional()),
  motivo: z.enum(MOTIVOS, { message: "Motivo inválido" }),
  mensaje: z
    .string()
    .trim()
    .min(10, "Contanos un poco más (mín. 10 caracteres)")
    .max(1000, "Mensaje muy largo (máx. 1000)")
    .refine((v) => !/<\s*script|<\s*iframe|on\w+\s*=/i.test(v), "Contenido no permitido")
    .refine((v) => (v.match(/https?:\/\//g) || []).length <= 1, "Sin spam de enlaces"),
  // Honeypot: los bots lo completan, los humanos no lo ven.
  empresa: z.string().max(0, "spam detectado").optional().default(""),
  // Token de Cloudflare Turnstile (puede venir vacío si aún no lo configuraste).
  turnstileToken: z.string().optional().default(""),
});

function getServerClient() {
  // service_role SOLO en servidor (nunca NEXT_PUBLIC_). Bypassa RLS a propósito:
  // la única vía de escritura a `contactos` es esta Server Action ya validada.
  // Un bot con la anon-key no puede insertar directo porque no hay policy de insert.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

// --- Rate limit en Supabase (3 envíos / 10 min por IP). Compartido entre
// instancias (serverless, clusters), a diferencia del Map en memoria.
// La tabla `rate_limits` solo la toca la service_role (RLS sin policies).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_OPS = 3;
async function rateLimitDB(supabase, ipHash) {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  // Limpieza oportunista de ventanas vencidas (tabla siempre chica).
  await supabase.from("rate_limits").delete().lt("created_at", since);
  const { count, error } = await supabase
    .from("rate_limits")
    .select("ip_hash", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error || (count ?? 0) >= MAX_OPS) return false;
  const { error: insErr } = await supabase
    .from("rate_limits")
    .insert({ ip_hash: ipHash });
  if (insErr) return false;
  return true;
}

export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Sin secret solo se saltea en desarrollo: en producción se falla a la vista.
  // (Si falta el secret en el deploy, el captcha no debe desactivarse solo.)
  if (!secret) {
    if (process.env.NODE_ENV !== "production") return { ok: true, skipped: true };
    return { ok: false, skipped: false };
  }
  if (!token) return { ok: false, skipped: false };
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip || "" }),
    });
    const data = await res.json();
    return { ok: Boolean(data.success), skipped: false };
  } catch {
    return { ok: false, skipped: false };
  }
}

export async function enviarContacto(raw) {
  const h = await headers();
  const ip = ipDeHeaders(h);
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 32);

  // 1) Honeypot primero (barato y efectivo contra bots tontos)
  if (raw?.empresa) {
    // Fingimos éxito para no dar pistas al bot.
    return { ok: true };
  }

  // 2) Validación Zod
  const parsed = ContactoSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || "Datos inválidos";
    throw new Error(msg);
  }
  const { nombre, telefono, email, motivo, mensaje, turnstileToken } = parsed.data;

  // 3) Turnstile (si está configurado)
  const t = await verifyTurnstile(turnstileToken, ip);
  if (!t.ok && !t.skipped) {
    throw new Error("Verificación anti-bot fallida. Probá de nuevo.");
  }

  const supabase = getServerClient();
  // Sin service_role en producción no se finge éxito: el cliente perdería
  // consultas sin aviso. En desarrollo se simula para trabajar sin backend.
  if (!supabase) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("No se pudo guardar, probá por WhatsApp.");
    }
    return { ok: true, local: true };
  }

  // 4) Rate limit (compartido entre instancias vía Supabase)
  if (!(await rateLimitDB(supabase, ipHash))) {
    throw new Error("Demasiados mensajes. Esperá unos minutos y probá de nuevo.");
  }

  const { error } = await supabase.from("contactos").insert({
    nombre,
    telefono,
    email: email || null,
    motivo,
    mensaje,
    estado: "nuevo",
    ip_hash: ipHash,
  });

  if (error) throw new Error("No se pudo guardar. Probá por WhatsApp.");
  return { ok: true };
}
