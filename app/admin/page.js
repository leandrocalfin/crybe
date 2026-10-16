import { redirect } from "next/navigation";
import { getAdminUser } from "../../lib/supabaseServer";
import Panel from "./panel";

export const metadata = {
  title: "Panel | Centro CRYBE",
  robots: { index: false, follow: false },
};

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

  const [{ data: contactos }, { data: profesionales }, { data: novedades }, { data: especialidades }, { data: secciones }, { data: nosItems }, { data: ajustesRows }, { data: portadas }] =
    await Promise.all([
      sb.from("contactos").select("id,nombre,telefono,email,motivo,mensaje,leido,created_at").order("created_at", { ascending: false }).limit(200),
      sb.from("profesionales").select("*").order("orden", { ascending: true }),
      sb.from("novedades").select("*").order("fecha_publicacion", { ascending: false }).limit(100),
      sb.from("especialidades").select("*").order("nombre", { ascending: true }),
      sb.from("secciones").select("*"),
      sb.from("nosotros_items").select("*").order("orden", { ascending: true }),
      sb.from("ajustes").select("*"),
      sb.from("portadas").select("*").order("orden", { ascending: true }),
    ]);

  const mapaSec = {};
  (secciones || []).forEach((s) => { mapaSec[s.slug] = s; });
  const ajustes = {};
  (ajustesRows || []).forEach((a) => { ajustes[a.clave] = a.valor || ""; });

  return (
    <Panel
      email={user.email}
      contactos={contactos || []}
      profesionales={profesionales || []}
      novedades={novedades || []}
      especialidades={especialidades || []}
      nosotros={{ seccion: mapaSec.nosotros || null, items: nosItems || [] }}
      ajustes={ajustes}
      portadas={portadas || []}
    />
  );
}
