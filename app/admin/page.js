import { redirect } from "next/navigation";
import { getAdminUser } from "../../lib/supabaseServer";
import Panel from "./panel";

export const metadata = {
  title: "Panel | Centro CRYBE",
  robots: { index: false, follow: false },
};

// Orden fijo: el índice i de esta lista corresponde al índice i de las
// consultas de Promise.all, para poder nombrar la tabla que falló.
const TABLAS = [
  "contactos",
  "profesionales",
  "novedades",
  "especialidades",
  "secciones",
  "nosotros_items",
  "ajustes",
  "portadas",
];

export default async function AdminPage() {
  const { sb, user, isAdmin } = await getAdminUser();

  if (!user) redirect("/admin/login");
  if (!isAdmin) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="max-w-[420px] rounded-[24px] border border-white/60 bg-white/80 p-8 text-center shadow backdrop-blur-xl">
          <h1 className="font-serif-display text-[24px] text-lila-900">Sin acceso</h1>
          <p className="mt-2 text-[14px] text-stone-500">
            Tu cuenta ({user.email}) no es administradora.
          </p>
          <a href="/admin/login" className="mt-4 inline-block text-[14px] font-semibold text-lila-700">
            Volver al login
          </a>
        </div>
      </main>
    );
  }

  const resultados = await Promise.all([
    sb.from("contactos").select("id,nombre,telefono,email,motivo,mensaje,leido,created_at").order("created_at", { ascending: false }).limit(200),
    sb.from("profesionales").select("*").order("orden", { ascending: true }),
    sb.from("novedades").select("*").order("fecha_publicacion", { ascending: false }).limit(100),
    sb.from("especialidades").select("*").order("nombre", { ascending: true }),
    sb.from("secciones").select("*"),
    sb.from("nosotros_items").select("*").order("orden", { ascending: true }),
    sb.from("ajustes").select("*"),
    sb.from("portadas").select("*").order("orden", { ascending: true }),
  ]);

  // Sin esto una tabla caída (RLS, grant o tabla inexistente) se veía igual
  // que una tabla vacía: `data` null -> `[]` y el panel renderizaba limpio.
  const fallos = resultados
    .map((r, i) => (r.error ? { tabla: TABLAS[i], code: r.error.code, mensaje: r.error.message } : null))
    .filter(Boolean);
  if (fallos.length) {
    console.error(
      `[admin] ${fallos.length}/${resultados.length} consultas fallaron: ` +
        fallos.map((f) => `${f.tabla} -> ${f.code}: ${f.mensaje}`).join(" | "),
    );
  }

  const [contactos, profesionales, novedades, especialidades, secciones, nosItems, ajustesRows, portadas] =
    resultados.map((r) => r.data);

  const mapaSec = {};
  (secciones || []).forEach((s) => { mapaSec[s.slug] = s; });
  const ajustes = {};
  (ajustesRows || []).forEach((a) => { ajustes[a.clave] = a.valor || ""; });

  return (
    <>
      {fallos.length > 0 && (
        <div className="mx-auto w-full max-w-[1180px] px-4 pt-6">
          <div className="rounded-[20px] border border-amber-300/70 bg-amber-50/90 p-5 shadow backdrop-blur-xl">
            <h2 className="font-serif-display text-[18px] text-amber-900">
              No se pudo cargar {fallos.length} de {resultados.length} secciones
            </h2>
            <p className="mt-1 text-[13px] text-amber-800">
              Lo que ves vacío abajo es un error de lectura, no falta de contenido. Revisá los
              grants y las policies de RLS en Supabase para estas tablas:
            </p>
            <ul className="mt-3 space-y-1">
              {fallos.map((f) => (
                <li key={f.tabla} className="text-[13px] text-amber-900">
                  <code className="font-semibold">{f.tabla}</code>
                  {f.code ? <span className="text-amber-700"> ({f.code})</span> : null}
                  <span className="text-amber-800"> — {f.mensaje}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <Panel
        contactos={contactos || []}
        profesionales={profesionales || []}
        novedades={novedades || []}
        especialidades={especialidades || []}
        nosotros={{ seccion: mapaSec.nosotros || null, items: nosItems || [] }}
        ajustes={ajustes}
        portadas={portadas || []}
      />
    </>
  );
}
