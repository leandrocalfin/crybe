import Navbar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import { getAdminUser } from "../../lib/supabaseServer";
import { getContenidoPublico } from "../../lib/contenido";

// El panel vive dentro del sitio: mismo navbar y footer públicos.
export default async function AdminLayout({ children }) {
  const [{ user, isAdmin }, contenido] = await Promise.all([
    getAdminUser().catch(() => ({ user: null, isAdmin: false })),
    getContenidoPublico(),
  ]);
  return (
    <div id="admin-panel" className="flex min-h-screen flex-col bg-[#F4F8FB]">
      <Navbar
        adminEmail={isAdmin ? user?.email : null}
        adminAvatar={contenido?.ajustes?.avatar || ""}
      />
      <div className="flex flex-1 flex-col pt-[124px] lg:pt-[134px]">{children}</div>
      <Footer />
    </div>
  );
}
