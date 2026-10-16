import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// GET /api/keepalive — query mínima real para que Supabase Free
// registre actividad y no pause el proyecto (7 días sin uso).
// La llama el Cron Trigger de Cloudflare (workers/keepalive-worker.js)
// cada 2 días con el header x-keepalive-secret.
// Usa solo la anon key. 200 = ok, 401 = sin autorización,
// 500 = falló la query (visible en los logs del cron).
export async function GET(request) {
  // Cerrado con secreto: sin KEEPALIVE_SECRET configurado se responde
  // 500 sin tocar Supabase (falla a la vista en vez de quedar abierto
  // en silencio por un olvido o typo en el nombre del secret).
  // Con secreto configurado y header incorrecto: 401.
  const secreto = process.env.KEEPALIVE_SECRET;
  if (!secreto) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("x-keepalive-secret") !== secreto) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ ok: false }, { status: 500 });
  // especialidades tiene lectura pública para anon (ver supabase/schema.sql),
  // así un error acá significa problema real (pausa, RLS, red).
  const sb = createClient(url, key);
  const { error } = await sb.from("especialidades").select("slug").limit(1);
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
