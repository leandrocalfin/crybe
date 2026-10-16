// Verificación RLS: el anon-key NO puede escribir en contactos (debe rebotar),
// pero SÍ puede leer profesionales. Correr con:
//   $env:NEXT_PUBLIC_SUPABASE_URL="https://..."; $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="..."; node scripts/verify-rls.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en el entorno.");
  process.exit(1);
}
const sb = createClient(url, anon);

let ok = true;

// 1) Insert directo con anon -> DEBE FALLAR (sin policy de insert)
const { error: insErr } = await sb.from("contactos").insert({
  nombre: "Test Bot",
  telefono: "+54 2984 000000",
  email: "bot@test.com",
  motivo: "Turnos y horarios",
  mensaje: "Este insert directo debe ser bloqueado por RLS.",
  estado: "nuevo",
});
if (insErr) {
  console.log("OK 1/3 · insert anon bloqueado:", insErr.message);
} else {
  console.log("FALLO 1/3 · el insert anon PASÓ (revisar policies: no debe existir insert para anon)");
  ok = false;
}

// 2) Lectura pública de profesionales -> DEBE FUNCIONAR
const { data: profs, error: profErr } = await sb.from("profesionales").select("slug").limit(1);
if (!profErr) {
  console.log(`OK 2/3 · lectura pública profesionales funciona (${profs?.length ?? 0} fila/s).`);
} else {
  console.log("FALLO 2/3 · lectura profesionales falló:", profErr.message);
  ok = false;
}

// 3) Lectura de contactos con anon -> DEBE FALLAR (solo admins)
const { error: selErr } = await sb.from("contactos").select("id").limit(1);
if (selErr) {
  console.log("OK 3/3 · lectura anon de contactos bloqueada:", selErr.message);
} else {
  console.log("FALLO 3/3 · anon pudo leer contactos (revisar policy contactos solo admins)");
  ok = false;
}

process.exit(ok ? 0 : 2);
