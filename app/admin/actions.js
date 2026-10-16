"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { randomUUID, createHash } from "node:crypto";
import { z } from "zod";
import { getSupabaseServer, getAdminUser } from "../../lib/supabaseServer";
import { ipDeHeaders } from "../../lib/ip";
import { getSupabaseService } from "../../lib/supabaseService";
import { verifyTurnstile } from "../actions";

const ESTADOS = ["nuevo", "contactado", "cerrado"];
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const CATEGORIAS = [
  "Psicología",
  "Psiquiatría",
  "Fonoaudiología",
  "Psicopedagogía",
  "Kinesiología y Psicomotricidad",
  "Equipo CRYBE",
];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function refrescar() {
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}

async function exigirAdmin() {
  const { sb, user, isAdmin } = await getAdminUser();
  if (!sb || !user || !isAdmin) throw new Error("Sin acceso.");
  return sb;
}

export async function marcarLeido(id, leido) {
  const parsed = z
    .object({ id: z.string().uuid(), leido: z.boolean() })
    .safeParse({ id, leido });
  if (!parsed.success) throw new Error("Datos inválidos.");
  const sb = await exigirAdmin();
  const { error } = await sb
    .from("contactos")
    .update({ leido })
    .eq("id", id);
  if (error) throw new Error("No se pudo actualizar.");
  revalidatePath("/admin");
  return { ok: true };
}

export async function eliminarContacto(id) {
  const parsed = z.object({ id: z.string().uuid() }).safeParse({ id });
  if (!parsed.success) throw new Error("Datos inválidos.");
  const sb = await exigirAdmin();
  const { error } = await sb.from("contactos").delete().eq("id", id);
  if (error) throw new Error("No se pudo eliminar.");
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleProfesional(id, activo) {
  const parsed = z
    .object({ id: z.string().uuid(), activo: z.boolean() })
    .safeParse({ id, activo });
  if (!parsed.success) throw new Error("Datos inválidos.");
  const sb = await exigirAdmin();
  const { error } = await sb
    .from("profesionales")
    .update({ activo })
    .eq("id", id);
  if (error) throw new Error("No se pudo actualizar.");
  refrescar();
  return { ok: true };
}

export async function cerrarSesion(destino = "/admin/login") {
  const sb = await getSupabaseServer();
  if (sb) await sb.auth.signOut();
  redirect(destino);
}

// ---------- FOTOS (Storage crybe-media, solo admin vía service_role) ----------

// Los primeros bytes del archivo definen el tipo real: file.type lo manda
// el navegador y se puede falsificar.
function detectarImagen(bytes) {
  const ascii = (i, s) =>
    String.fromCharCode(...bytes.slice(i, i + s.length)) === s;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "image/webp";
  if (ascii(4, "ftyp") && (ascii(8, "avif") || ascii(8, "avis"))) return "image/avif";
  return null;
}

export async function subirFoto(formData) {
  await exigirAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Elegí una imagen.");
  if (file.size > 4 * 1024 * 1024) throw new Error("Máximo 4MB.");
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!detectarImagen(head)) throw new Error("Archivo inválido: no es JPG, PNG, WEBP o AVIF.");
  const svc = getSupabaseService();
  if (!svc) throw new Error("Falta configuración del servidor.");
  // Reconvierte a WebP con sharp (Node/Vercel): saca EXIF (GPS incluido)
  // y descarta archivos con encabezado válido pero contenido corrupto.
  // En Cloudflare Workers sharp no existe (módulo nativo): se sube el
  // original tal cual (el cliente ya comprime en lib/comprimir.js).
  const bytes = Buffer.from(await file.arrayBuffer());
  const tipoReal = detectarImagen(head) || "image/jpeg";
  let procesada;
  let contentType = "image/webp";
  let ext = "webp";
  try {
    const { default: sharp } = await import("sharp");
    try {
      procesada = await sharp(bytes)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      throw new Error("No se pudo procesar la imagen.");
    }
  } catch (e) {
    if (e?.message === "No se pudo procesar la imagen.") throw e;
    // sharp no disponible (Workers): subo el original.
    procesada = bytes;
    contentType = tipoReal;
    ext = tipoReal === "image/png" ? "png" : tipoReal === "image/webp" ? "webp" : tipoReal === "image/avif" ? "avif" : "jpg";
  }
  const path = `media/${randomUUID()}.${ext}`;
  const { error } = await svc.storage
    .from("crybe-media")
    .upload(path, procesada, { contentType, upsert: false });
  if (error) throw new Error("No se pudo subir la imagen.");
  const { data } = svc.storage.from("crybe-media").getPublicUrl(path);
  return { url: data.publicUrl };
}

// ---------- PROFESIONALES (alta, edición, baja lógica, borrado) ----------

const ProfesionalSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(2).max(80).regex(SLUG, "Slug inválido (solo minúsculas, números y guiones)"),
  nombre: z.string().trim().min(2).max(80),
  especialidad: z.string().trim().min(2).max(80),
  especialidad_slug: z.string().trim().min(2).max(80).regex(SLUG, "Slug de especialidad inválido"),
  modalidad: z.string().trim().max(80).default("Atención presencial"),
  foto_url: z.string().trim().max(500).default(""),
  matricula: z.string().trim().max(40).default(""),
  resumen: z.string().trim().max(300).default(""),
  descripcion: z.string().trim().max(2000).default(""),
  whatsapp: z.string().trim().min(8).max(20).regex(/^[+0-9]+$/, "WhatsApp solo números (con código país, ej. 5492984123456)"),
  dias: z.array(z.enum(DIAS)).default([]),
  horarios: z.string().trim().max(60).default(""),
  mostrar_horarios: z.boolean().default(true),
  areas: z.array(z.string().trim().min(1).max(200)).max(12).default([]),
  activo: z.boolean().default(true),
  orden: z.number().int().min(0).max(100).default(0),
});

export async function guardarProfesional(raw) {
  const sb = await exigirAdmin();
  const parsed = ProfesionalSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Datos inválidos.");
  const { id, ...datos } = parsed.data;
  // La especialidad tiene que existir (FK real en DB, chequeo previo para buen mensaje).
  const { data: esp } = await sb.from("especialidades").select("slug").eq("slug", datos.especialidad_slug).maybeSingle();
  if (!esp) throw new Error("La especialidad elegida no existe.");
  let error;
  if (id) {
    ({ error } = await sb.from("profesionales").update(datos).eq("id", id));
  } else {
    ({ error } = await sb.from("profesionales").insert(datos));
  }
  if (error) {
    if (error.code === "23505") throw new Error("Ese slug ya existe, elegí otro.");
    throw new Error("No se pudo guardar.");
  }
  refrescar();
  return { ok: true };
}

export async function eliminarProfesional(id) {
  const sb = await exigirAdmin();
  const parsed = z.object({ id: z.string().uuid() }).safeParse({ id });
  if (!parsed.success) throw new Error("Datos inválidos.");
  const { error } = await sb.from("profesionales").delete().eq("id", parsed.data.id);
  if (error) throw new Error("No se pudo eliminar.");
  refrescar();
  return { ok: true };
}

// ---------- NOVEDADES ----------

const NovedadSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(2).max(100).regex(SLUG, "Slug inválido"),
  categoria: z.enum(CATEGORIAS, { message: "Categoría inválida" }),
  titulo: z.string().trim().min(4).max(160),
  descripcion: z.string().trim().min(10).max(400),
  cuerpo: z.array(z.string().trim().min(1).max(2000)).min(1).max(20),
  imagen_principal: z.string().trim().max(500).default(""),
  galeria: z.array(z.string().trim().min(1).max(500)).max(10).default([]),
  autor: z.string().trim().max(80).default("Equipo CRYBE"),
  fecha_publicacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida").optional(),
  publicado: z.boolean().default(true),
});

export async function guardarNovedad(raw) {
  await exigirAdmin();
  const svc = getSupabaseService();
  if (!svc) throw new Error("Falta configuración del servidor.");
  const parsed = NovedadSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Datos inválidos.");
  const { id, ...datos } = parsed.data;
  let error;
  if (id) {
    ({ error } = await svc.from("novedades").update(datos).eq("id", id));
  } else {
    ({ error } = await svc.from("novedades").insert(datos));
  }
  if (error) {
    if (error.code === "23505") throw new Error("Ese slug ya existe, elegí otro.");
    throw new Error("No se pudo guardar.");
  }
  refrescar();
  return { ok: true };
}

export async function eliminarNovedad(id) {
  const parsed = z.object({ id: z.string().uuid() }).safeParse({ id });
  if (!parsed.success) throw new Error("Datos inválidos.");
  await exigirAdmin();
  const svc = getSupabaseService();
  const { error } = await svc.from("novedades").delete().eq("id", id);
  if (error) throw new Error("No se pudo eliminar.");
  refrescar();
  return { ok: true };
}

// ---------- NOSOTROS (cabecera + ítems, máx 8) ----------

const ICONOS_VALIDOS = [
  "Handshake", "Brain", "Network", "Sprout", "Users", "ClipboardCheck",
  "HeartHandshake", "Armchair", "Sparkles", "Heart", "Star", "Baby", "Lightbulb",
];

export async function guardarSeccion(raw) {
  const parsed = z
    .object({
      slug: z.enum(["nosotros", "especialidades"], { message: "Sección inválida" }),
      titulo: z.string().trim().min(4).max(160),
      descripcion: z.string().trim().min(10).max(2000),
    })
    .safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Datos inválidos.");
  const sb = await exigirAdmin();
  const { error } = await sb.from("secciones").upsert(parsed.data, { onConflict: "slug" });
  if (error) throw new Error("No se pudo guardar.");
  refrescar();
  return { ok: true };
}

// Alias anterior (Nosotros lo sigue usando).
export async function guardarSeccionNosotros(raw) {
  return guardarSeccion({ ...raw, slug: "nosotros" });
}

const NosotrosItemSchema = z.object({
  id: z.string().uuid().optional(),
  icono: z.enum(ICONOS_VALIDOS, { message: "Icono inválido" }),
  titulo: z.string().trim().min(2).max(60),
  texto: z.string().trim().min(10).max(500),
  orden: z.number().int().min(0).max(100).default(0),
  activo: z.boolean().default(true),
});

export async function guardarNosotrosItem(raw) {
  const sb = await exigirAdmin();
  const parsed = NosotrosItemSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Datos inválidos.");
  // Tope de 8 ítems activos al crear uno nuevo.
  if (!parsed.data.id) {
    const { count } = await sb.from("nosotros_items").select("id", { count: "exact", head: true }).eq("activo", true);
    if ((count || 0) >= 8) throw new Error("Máximo 8 ítems.");
  }
  const { id, ...datos } = parsed.data;
  let error;
  if (id) {
    ({ error } = await sb.from("nosotros_items").update(datos).eq("id", id));
  } else {
    ({ error } = await sb.from("nosotros_items").insert(datos));
  }
  if (error) throw new Error("No se pudo guardar.");
  refrescar();
  return { ok: true };
}

export async function eliminarNosotrosItem(id) {
  const parsed = z.object({ id: z.string().uuid() }).safeParse({ id });
  if (!parsed.success) throw new Error("Datos inválidos.");
  const sb = await exigirAdmin();
  const { error } = await sb.from("nosotros_items").delete().eq("id", id);
  if (error) throw new Error("No se pudo eliminar.");
  refrescar();
  return { ok: true };
}

// ---------- AJUSTES (datos y redes) ----------

const AJUSTES_CLAVES = [
  "whatsapp", "telefono", "email", "instagram", "facebook",
  "direccion", "direccion_corta", "mapa", "horario_lv", "horario_sab", "avatar",
];

export async function guardarAjustes(raw) {
  const parsed = z.record(z.string().trim().max(500)).safeParse(raw);
  if (!parsed.success) throw new Error("Datos inválidos.");
  const sb = await exigirAdmin();
  const filas = Object.entries(parsed.data)
    .filter(([k, v]) => AJUSTES_CLAVES.includes(k))
    .map(([clave, valor]) => {
      let v = valor;
      if (clave === "whatsapp") {
        v = v.replace(/[^0-9]/g, "");
        if (v && (v.length < 10 || v.length > 15)) throw new Error("WhatsApp inválido.");
      }
      if (clave === "email" && v && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)) {
        throw new Error("Email inválido.");
      }
      if ((clave === "instagram" || clave === "facebook") && v && !/^https?:\/\//.test(v)) {
        throw new Error("La URL debe empezar con http.");
      }
      return { clave, valor: v };
    });
  if (!filas.length) throw new Error("Nada para guardar.");
  const { error } = await sb.from("ajustes").upsert(filas, { onConflict: "clave" });
  if (error) throw new Error("No se pudo guardar.");
  refrescar();
  return { ok: true };
}

// ---------- CONTRASEÑA ----------

export async function cambiarPassword(nueva, confirmar) {
  const parsed = z
    .object({
      nueva: z.string().min(8, "Mínimo 8 caracteres").max(72),
      confirmar: z.string(),
    })
    .safeParse({ nueva, confirmar });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Datos inválidos.");
  if (nueva !== confirmar) throw new Error("No coinciden.");
  const { sb, user, isAdmin } = await getAdminUser();
  if (!sb || !user || !isAdmin) throw new Error("Sin acceso.");
  const { error } = await sb.auth.updateUser({ password: nueva });
  if (error) throw new Error("No se pudo cambiar.");
  return { ok: true };
}

// ---------- PORTADAS (hero del Inicio, tabla propia) ----------

const PortadaSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().trim().max(80).default(""),
  titulo: z.string().trim().min(2, "El título es obligatorio").max(200),
  subtitulo: z.string().trim().max(600).default(""),
  imagen: z.string().trim().max(500).default(""),
  orden: z.number().int().min(0).max(100).default(0),
  activo: z.boolean().default(true),
});

export async function guardarPortada(raw) {
  const sb = await exigirAdmin();
  const parsed = PortadaSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Datos inválidos.");
  const { id, ...datos } = parsed.data;
  let error;
  if (id) {
    ({ error } = await sb.from("portadas").update(datos).eq("id", id));
  } else {
    ({ error } = await sb.from("portadas").insert(datos));
  }
  if (error) throw new Error("No se pudo guardar.");
  refrescar();
  return { ok: true };
}

export async function eliminarPortada(id) {
  const parsed = z.object({ id: z.string().uuid() }).safeParse({ id });
  if (!parsed.success) throw new Error("Datos inválidos.");
  const sb = await exigirAdmin();
  const { error } = await sb.from("portadas").delete().eq("id", id);
  if (error) throw new Error("No se pudo eliminar.");
  refrescar();
  return { ok: true };
}

// ---------- ESPECIALIDADES ----------

export async function guardarEspecialidad(raw) {
  const parsed = z
    .object({
      id: z.string().uuid().optional(),
      slug: z.string().trim().min(2).max(80).regex(SLUG, "Slug inválido").optional(),
      nombre: z.string().trim().min(2).max(80).optional(),
      titulo: z.string().trim().max(200).default(""),
      descripcion: z.string().trim().max(600).default(""),
      imagen: z.string().trim().max(500).default(""),
      hero_titulo: z.string().trim().max(200).default(""),
      hero_subtitulo: z.string().trim().max(600).default(""),
      hero_imagen: z.string().trim().max(500).default(""),
    })
    .safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Datos inválidos.");
  const sb = await exigirAdmin();
  const { id, slug, nombre, ...datos } = parsed.data;
  let error;
  if (id) {
    // Solo se actualizan los campos enviados (hero y tarjeta se editan por separado).
    const cambios = {};
    ["nombre", "titulo", "descripcion", "imagen", "hero_titulo", "hero_subtitulo", "hero_imagen"].forEach((k) => {
      if (k in raw) cambios[k] = parsed.data[k];
    });
    ({ error } = await sb.from("especialidades").update(cambios).eq("id", id));
  } else {
    if (!slug || !nombre) throw new Error("Slug y nombre son obligatorios.");
    ({ error } = await sb.from("especialidades").insert({ slug, nombre, ...datos }));
  }
  if (error) {
    if (error.code === "23505") throw new Error("Ese slug ya existe, elegí otro.");
    throw new Error("No se pudo guardar.");
  }
  refrescar();
  return { ok: true };
}

export async function eliminarEspecialidad(id) {
  const parsed = z.object({ id: z.string().uuid() }).safeParse({ id });
  if (!parsed.success) throw new Error("Datos inválidos.");
  const sb = await exigirAdmin();
  const { error } = await sb.from("especialidades").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") throw new Error("Tiene profesionales asignados: cambialos de especialidad primero.");
    throw new Error("No se pudo eliminar.");
  }
  refrescar();
  return { ok: true };
}

// ---------- LOGIN CON BLOQUEO POR INTENTOS (5 fallidos / 15 min por IP) ----------

const LOGIN_MAX = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function loginAdmin(email, password, captchaToken) {
  const parsed = z
    .object({ email: z.string().trim().min(3).max(160), password: z.string().min(1).max(200) })
    .safeParse({ email, password });
  if (!parsed.success) throw new Error("Email o contraseña incorrectos.");
  const h = await headers();
  const ip = ipDeHeaders(h);
  const clave = `login:${createHash("sha256").update(ip).digest("hex").slice(0, 32)}`;
  const svc = getSupabaseService();
  if (!svc) throw new Error("Falta configuración del servidor.");
  const since = new Date(Date.now() - LOGIN_WINDOW_MS).toISOString();
  // Limpieza oportunista de ventanas vencidas.
  await svc.from("login_attempts").delete().lt("created_at", since);
  const { count } = await svc
    .from("login_attempts")
    .select("clave", { count: "exact", head: true })
    .eq("clave", clave)
    .gte("created_at", since);
  if ((count ?? 0) >= LOGIN_MAX) {
    throw new Error("Demasiados intentos. Esperá 15 minutos e intentá de nuevo.");
  }
  const fallar = async (msg) => {
    await svc.from("login_attempts").insert({ clave });
    throw new Error(msg);
  };
  // Captcha verificado en servidor (si está configurado).
  const t = await verifyTurnstile(captchaToken || "", ip);
  if (!t.ok && !t.skipped) await fallar("La verificación anti-bot falló. Intentá de nuevo.");
  const sb = await getSupabaseServer();
  if (!sb) throw new Error("Falta configuración del servidor.");
  const { data, error } = await sb.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { captchaToken: captchaToken || undefined },
  });
  if (error || !data?.user) await fallar("Email o contraseña incorrectos.");
  // Éxito: limpia intentos y confirma que sea admin (si no, cierra sesión).
  await svc.from("login_attempts").delete().eq("clave", clave);
  const { data: adm } = await sb.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!adm) {
    await sb.auth.signOut();
    throw new Error("Esta cuenta no es administradora.");
  }
  return { ok: true };
}
