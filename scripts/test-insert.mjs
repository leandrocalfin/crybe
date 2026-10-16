// Diagnóstico: replica el insert del Server Action con la service_role de .env.local
// e imprime el error exacto. NO imprime keys.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.log("DIAG: faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}
console.log("DIAG: URL fmt " + ( /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(serviceKey ? url : "") ? "OK" : "MALA" ));
console.log("DIAG: service key len " + serviceKey.length + " prefix " + serviceKey.slice(0, 8));

const sb = createClient(url, serviceKey);
const { data, error } = await sb.from("contactos").insert({
  nombre: "Prueba Diagnostico",
  telefono: "+54 2984 123456",
  email: "prueba@test.com",
  motivo: "Turnos y horarios",
  mensaje: "Diagnóstico de funcionamiento del formulario de contacto.",
  estado: "nuevo",
  ip_hash: "diag",
}).select("id");

if (error) {
  console.log("DIAG ERROR code:", error.code);
  console.log("DIAG ERROR message:", error.message);
  console.log("DIAG ERROR details:", error.details);
  console.log("DIAG ERROR hint:", error.hint);
} else {
  console.log("DIAG OK: insert funcionó, id=", data?.[0]?.id);
  // Limpieza: borrar la fila de prueba
  if (data?.[0]?.id) await sb.from("contactos").delete().eq("id", data[0].id);
}
