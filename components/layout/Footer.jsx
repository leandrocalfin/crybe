"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const textosLegales = {
  aviso: {
    titulo: "Aviso Legal",
    cuerpo: [
      "Centro CRYBE es un espacio interdisciplinario dedicado a la rehabilitación y el bienestar emocional, con sede en Tucumán 445, General Roca, Río Negro.",
      "Los contenidos de este sitio tienen fines informativos y no reemplazan la consulta profesional. Cada tratamiento se define de manera personalizada con el profesional tratante.",
      "El uso de este sitio implica la aceptación de estas condiciones.",
    ],
  },
  privacidad: {
    titulo: "Política de Privacidad",
    cuerpo: [
      "Los datos que compartís a través de nuestros formularios (nombre, teléfono, email y mensaje) se utilizan únicamente para responder a tu consulta.",
      "No compartimos tu información con terceros con fines comerciales. Podés solicitar en cualquier momento la modificación o eliminación de tus datos escribiéndonos por nuestros canales de contacto.",
    ],
  },
  cookies: {
    titulo: "Política de Cookies",
    cuerpo: [
      "Este sitio web utiliza cookies propias y de terceros para garantizar su correcto funcionamiento, recordar tus preferencias y analizar el tráfico con fines estadísticos.",
      "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo al navegar. Podés desactivarlas o eliminarlas desde la configuración de tu navegador en cualquier momento; sin embargo, algunas funciones del sitio podrían verse afectadas.",
    ],
  },
};

const navegacion = [
  { nombre: "Inicio", href: "#inicio" },
  { nombre: "Nosotros", href: "#nosotros" },
  { nombre: "Especialidades", href: "#especialidades" },
  { nombre: "Novedades", href: "#novedades" },
  { nombre: "Contacto", href: "#contacto" },
];

const Footer = ({ ajustes }) => {
  const [legal, setLegal] = useState(null);
  const anioActual = new Date().getFullYear();
  const DIRECCION_CORTA = ajustes?.mapa || "Tucuman 445, General Roca";
  const TELEFONO = ajustes?.telefono || "298 425-4590";

  return (
    <footer
      className="relative overflow-hidden px-4 text-white sm:px-6 md:px-12 lg:px-16"
      style={{
        background:
          "linear-gradient(120deg, #0E2F66 0%, #14489B 45%, #1A6AB5 100%)",
      }}
    >
      {/* Resplandor suave */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-0 h-[300px] w-[300px] rounded-full bg-[#2AA3D5]/25 blur-[100px]" />
        <div className="absolute -left-24 bottom-0 h-[260px] w-[260px] rounded-full bg-[#0A2350]/40 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px]">

        {/* ===== TABLET / DESKTOP: FOOTER COMPLETO ===== */}
        <div className="hidden sm:block">

          {/* CONTENIDO PRINCIPAL */}
          <div className="grid gap-4 py-3 sm:py-4 md:grid-cols-[1.4fr_0.7fr_0.9fr] md:gap-5 md:py-3 lg:grid-cols-[1.4fr_0.7fr_0.9fr] lg:gap-6 lg:py-3">

            {/* IDENTIDAD */}
            <div>
              <div className="flex items-center gap-3 sm:gap-4">

                {/* LOGO */}
                <div
                  className="
                    group
                    flex h-[56px] w-[56px]
                    items-center justify-center
                    overflow-hidden
                    rounded-[16px]
                    border border-white/20
                    bg-white
                    p-2
                    sm:h-[56px] sm:w-[56px]
                    md:h-[56px] md:w-[56px]
                    lg:h-[60px] lg:w-[60px]
                  "
                >
                  <img
                    src="/logoSinFondo.png"
                    alt="Centro CRYBE"
                    className="
                      h-full w-full
                      object-contain
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-110
                    "
                  />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase leading-[1.6] tracking-[0.08em] text-[#FFFFFF] sm:text-[12px]">
                    Centro de Rehabilitación
                    <br />
                    y Bienestar Emocional
                  </p>
                </div>
              </div>

              <p className="mt-2 max-w-[440px] text-[12px] leading-5 text-[#FFFFFF]/75 sm:text-[13px]">
                Un espacio interdisciplinario dedicado al acompañamiento y
                bienestar, brindando una atención cercana, profesional y
                personalizada.
              </p>

              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFFFFF] sm:text-[12px]">
                Somos Crybe
              </p>

              <p className="mt-1 text-[11px] tracking-wide text-[#FFFFFF]/65 sm:text-[12px]">
                General Roca · Río Negro
              </p>
            </div>

            {/* NAVEGACIÓN */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFFFFF] sm:text-[12px]">
                Navegación
              </p>

              <nav className="mt-2 flex flex-col items-start">
                {navegacion.map((item) => (
                  <a
                    key={item.nombre}
                    href={item.href}
                    className="
                      text-[13px]
                      text-[#FFFFFF]/75
                      transition-colors
                      duration-300
                      hover:text-[#FFFFFF]
                      min-h-[44px] flex items-center
                      sm:min-h-6
                      sm:text-[14px]
                    "
                  >
                    {item.nombre}
                  </a>
                ))}
              </nav>
            </div>

            {/* CONTACTO */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFFFFF] sm:text-[12px]">
                Contacto
              </p>

              <div className="mt-2 space-y-2">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FFFFFF]/65 sm:text-[11px]">
                    Ubicación
                  </p>

                  <p className="mt-1.5 text-[13px] text-[#FFFFFF] sm:text-[14px]">
                    {DIRECCION_CORTA}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FFFFFF]/65 sm:text-[11px]">
                    WhatsApp
                  </p>

                  <a
                    href="#contacto"
                    className="mt-1.5 block text-[13px] text-[#FFFFFF] transition hover:brightness-125 min-h-[44px] flex items-center sm:min-h-6 sm:text-[14px]"
                  >
                    {TELEFONO}
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* PARTE INFERIOR */}
          <div
            className="
              flex flex-col items-center gap-1
              border-t border-[#FFFFFF]/15
              pt-2.5 pb-1.5
              text-center
              text-[10px]
              text-[#FFFFFF]/65
              sm:flex-row
              sm:flex-wrap
              sm:justify-center
              sm:gap-x-2
              sm:gap-y-0.5
              sm:pt-2.5
              sm:pb-1.5
              sm:text-[11px]
            "
          >
            <p className="flex min-h-[44px] items-center justify-center sm:min-h-7">
              © {anioActual} Centro CRYBE. Todos los derechos reservados.
            </p>

            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-[#FFFFFF]/30 sm:block" />

            <button
              type="button"
              onClick={() => setLegal("aviso")}
              className="flex min-h-[44px] items-center transition-colors hover:text-[#FFFFFF] sm:min-h-7"
            >
              Aviso Legal
            </button>

            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-[#FFFFFF]/30 sm:block" />

            <button
              type="button"
              onClick={() => setLegal("privacidad")}
              className="flex min-h-[44px] items-center transition-colors hover:text-[#FFFFFF] sm:min-h-7"
            >
              Política de Privacidad
            </button>

            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-[#FFFFFF]/30 sm:block" />

            <button
              type="button"
              onClick={() => setLegal("cookies")}
              className="flex min-h-[44px] items-center transition-colors hover:text-[#FFFFFF] sm:min-h-7"
            >
              Política de Cookies
            </button>

            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-[#FFFFFF]/30 sm:block" />

            <a
              href="/admin/login"
              className="flex min-h-[44px] items-center transition-colors hover:text-[#FFFFFF] sm:min-h-7"
            >
              Acceso admin
            </a>
          </div>

          {/* CRÉDITO */}
          <p className="flex items-center justify-center pt-0.5 pb-1.5 text-[10px] text-[#FFFFFF]/55 sm:text-[11px]">
            Sitio desarrollado por Leandro Calfin
          </p>
        </div>

        {/* ===== MOBILE: FOOTER SIMPLIFICADO ===== */}
        <div className="sm:hidden">

          {/* IDENTIDAD */}
          <div className="flex flex-col items-center py-6 text-center">
            <div
              className="
                group
                flex h-[56px] w-[56px]
                items-center justify-center
                overflow-hidden
                rounded-[16px]
                border border-white/20
                bg-white
                p-2
              "
            >
              <img
                src="/logoSinFondo.png"
                alt="Centro CRYBE"
                className="
                  h-full w-full
                  object-contain
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-110
                "
              />
            </div>

            <p className="mt-3 text-[11px] font-semibold uppercase leading-[1.6] tracking-[0.08em] text-[#FFFFFF]">
              Centro de Rehabilitación
              <br />
              y Bienestar Emocional
            </p>

            <p className="mt-2 max-w-[440px] text-[12px] leading-5 text-[#FFFFFF]/75">
              Un espacio interdisciplinario dedicado al acompañamiento y
              bienestar, brindando una atención cercana, profesional y
              personalizada.
            </p>
          </div>

          {/* PARTE INFERIOR */}
          <div
            className="
              flex flex-col items-center gap-0.5
              border-t border-[#FFFFFF]/15
              pt-2.5 pb-1.5
              text-center
              text-[10px]
              text-[#FFFFFF]/65
            "
          >
            <p className="text-[10px] text-[#FFFFFF]/65">
              © {anioActual} Centro CRYBE. Todos los derechos reservados.
            </p>

            <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-[#FFFFFF]/30" />

              <button
                type="button"
                onClick={() => setLegal("aviso")}
                className="flex min-h-[44px] items-center transition-colors hover:text-[#FFFFFF]"
              >
                Aviso Legal
              </button>

              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#FFFFFF]/30" />

              <button
                type="button"
                onClick={() => setLegal("privacidad")}
                className="flex min-h-[44px] items-center transition-colors hover:text-[#FFFFFF]"
              >
                Política de Privacidad
              </button>

              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#FFFFFF]/30" />

              <button
                type="button"
                onClick={() => setLegal("cookies")}
                className="flex min-h-[44px] items-center transition-colors hover:text-[#FFFFFF]"
              >
                Política de Cookies
              </button>

              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#FFFFFF]/30" />

              <a
                href="/admin/login"
                className="flex min-h-[44px] items-center transition-colors hover:text-[#FFFFFF]"
              >
                Acceso admin
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL LEGAL */}
      <AnimatePresence>
        {legal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLegal(null)}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0A1830]/60 backdrop-blur-sm sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={textosLegales[legal].titulo}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[24px] bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-[#1F1F1F] shadow-2xl sm:rounded-[28px] sm:pb-6 md:p-8"
            >
              <button
                type="button"
                onClick={() => setLegal(null)}
                aria-label="Cerrar"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4FB] text-[#0F3A7A] transition-colors hover:bg-[#0F3A7A] hover:text-white"
              >
                <X size={19} />
              </button>

              <h3 className="pr-12 font-titulo text-[22px] font-semibold">
                {textosLegales[legal].titulo}
              </h3>
              <div className="mt-4 space-y-3">
                {textosLegales[legal].cuerpo.map((parrafo, i) => (
                  <p key={i} className="text-[14px] leading-7 text-[#4B5563]">
                    {parrafo}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
