import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import WhatsApp from "../components/layout/WhatsApp";
import FondoContinuo from "../components/layout/FondoContinuo";
import Hero from "../components/home/Hero";
import Nosotros from "../components/home/Nosotros";
import Especialidades from "../components/home/Especialidades";
import Equipo from "../components/home/Equipo";
import AlquilerModulos from "../components/home/AlquilerModulos";
import Novedades from "../components/home/Novedades";
import Contacto from "../components/home/Contacto";
import { getContenidoPublico } from "../lib/contenido";
import { getAdminUser } from "../lib/supabaseServer";

// Página dinámica a propósito: getAdminUser() usa cookies(), así que cada
// request trae el contenido fresco (lo editado en /admin se ve al instante).

export default async function Home() {
  const [contenido, { user, isAdmin }] = await Promise.all([
    getContenidoPublico(),
    getAdminUser().catch(() => ({ user: null, isAdmin: false })),
  ]);

  return (
    <div className="min-h-screen bg-[#F4F8FB]">
      <Navbar
        adminEmail={isAdmin ? user?.email : null}
        adminAvatar={contenido?.ajustes?.avatar || ""}
      />
      <main className="relative bg-[#F4F8FB]">
        <FondoContinuo />
        <div className="relative">
          <Hero slides={contenido?.hero} />
          <Nosotros
            titulo={contenido?.nosotros?.titulo}
            parrafos={contenido?.nosotros?.parrafos}
            items={contenido?.nosotros?.items}
          />
          <Especialidades
            items={contenido?.especialidades}
            titulo={contenido?.seccionEspecialidades?.titulo}
            descripcion={contenido?.seccionEspecialidades?.descripcion}
          />
          <Equipo lista={contenido?.profesionales} />
          <AlquilerModulos />
          <Novedades items={contenido?.novedades} />
          <Contacto ajustes={contenido?.ajustes} />
        </div>
      </main>
      <Footer ajustes={contenido?.ajustes} />
      <WhatsApp numero={contenido?.ajustes?.whatsapp} />
    </div>
  );
}
