"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, CalendarDays, MapPin, Video } from "lucide-react";

import { profesionales } from "../../data/profesionales";

const fotoInicial = (profesional) => {
  const apellido = profesional.nombre?.trim().split(/\s+/).pop() || "";
  return `/${apellido}.png`;
};

const FotoConFallback = ({ profesional, className }) => {
  const [fotoSrc, setFotoSrc] = useState(fotoInicial(profesional));

  useEffect(() => {
    setFotoSrc(fotoInicial(profesional));
  }, [profesional]);

  return (
    <img
      src={fotoSrc}
      onError={() => {
        const apellido =
          profesional.nombre?.trim().split(/\s+/).pop() || "";
        if (fotoSrc === `/${apellido}.png`) {
          setFotoSrc(`/${apellido}.jpeg`);
        } else if (fotoSrc !== profesional.foto) {
          setFotoSrc(profesional.foto);
        }
      }}
      alt={profesional.nombre}
      loading="lazy"
      className={className}
    />
  );
};

const TarjetaProfesional = ({ profesional, index, onVerPerfil }) => {
  const waLink = `https://wa.me/${profesional.whatsapp}?text=${encodeURIComponent(`Hola ${profesional.nombre}, quiero consultar por un turno en CRYBE.`)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="
        flex h-full flex-col justify-between rounded-none border border-[#D5E0EE] bg-white p-2 lg:p-3
        shadow-[0_12px_32px_-8px_rgba(30,40,80,0.28)]
        transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-12px_rgba(15,58,122,0.35)]
      "
    >
      <div>
        {/* ESPECIALIDAD ARRIBA */}
        <span className="mb-1 block text-center text-[9px] font-bold uppercase tracking-[0.12em] text-[#1A63B4] sm:text-[10px]">
          {profesional.especialidad}
        </span>
        {/* FOTO + NOMBRE ABAJO */}
        <div className="mb-1 flex flex-col items-center gap-1 text-center">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#EAF4FB] shadow-[0_6px_18px_rgba(15,58,122,0.18)] md:h-14 md:w-14 lg:h-16 lg:w-16">
            <FotoConFallback
              profesional={profesional}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <h3 className="font-titulo text-[13px] font-bold leading-tight text-[#1F1F1F] md:text-[14px] lg:text-[15px]">
              {profesional.nombre}
            </h3>
            <span className="text-[11.5px] text-[#6B7280] sm:text-[12.5px]">
              {profesional.matricula}
            </span>
          </div>
        </div>

      </div>

      <div className="mt-1 flex flex-col gap-1">
        <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#4B5563] sm:text-[12px]">
          {profesional.modalidad?.includes("online") ? (
            <Video size={13} className="text-[#1A63B4]" />
          ) : (
            <MapPin size={13} className="text-[#1A63B4]" />
          )}
          {profesional.modalidad || "Atención presencial"}
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex w-full sm:w-auto items-center justify-center gap-1 self-center rounded-full
            bg-[#25D366] px-2 py-1.5 text-[9px] font-semibold whitespace-nowrap text-white sm:px-3 sm:py-2.5 sm:text-[11px] lg:px-4 lg:text-[12px]
            shadow-[0_8px_22px_rgba(37,211,102,0.4)]
            transition-all duration-300 hover:-translate-y-[2px] hover:brightness-95 min-h-[26px] sm:min-h-[36px]
          "
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true" className="sm:hidden">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.03h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" />
          </svg>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true" className="hidden sm:block">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.03h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" />
          </svg>
          Solicitar turno por WhatsApp
        </a>
        <button
          type="button"
          onClick={() => onVerPerfil(profesional)}
          className="text-center text-[12px] font-semibold text-[#1A63B4] transition-colors hover:text-[#0F3A7A] min-h-[22px] flex items-center justify-center cursor-pointer"
        >
          Ver perfil completo
        </button>
      </div>
    </motion.article>
  );
};

const Equipo = ({ lista: listaProp }) => {
  const [filtro, setFiltro] = useState("todos");
  const [perfil, setPerfil] = useState(null);

  const base = listaProp?.length ? listaProp : profesionales;
  // Filtros dinámicos: salen de las especialidades que existan (incluye las nuevas del admin).
  const filtros = useMemo(() => {
    const vistos = new Map();
    base.forEach((p) => {
      if (p.activo !== false && p.especialidadSlug && !vistos.has(p.especialidadSlug)) {
        vistos.set(p.especialidadSlug, p.especialidad);
      }
    });
    return [
      { id: "todos", nombre: "Todos los Especialistas" },
      ...[...vistos.entries()].map(([id, nombre]) => ({ id, nombre: id === "kinesiologia-psicomotricidad" ? "Kinesiología" : nombre })),
    ];
  }, [base]);
  const lista = base.filter(
    (p) => p.activo !== false && (filtro === "todos" || p.especialidadSlug === filtro)
  );

  // Cerrar con Escape y congelar el scroll de fondo
  useEffect(() => {
    if (!perfil) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPerfil(null);
    };
    document.addEventListener("keydown", onKey);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo;
    };
  }, [perfil]);

  return (
    <section
      id="equipo"
      data-navbar-color="#FAFBFF"
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-16"
      style={{ background: "#FAFBFF" }}
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-6 max-w-[780px] text-center sm:mb-8"
        >
          <p className="font-titulo text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0F3A7A] sm:text-[15px]">
            Staff Terapéutico
          </p>
          <h2 className="mt-2 font-titulo text-[26px] font-semibold leading-tight text-[#1F1F1F] sm:text-[30px] md:text-[38px]">
            Equipo Profesional Interdisciplinario
          </h2>

          {/* ACLARACIÓN FUNCIONAL */}
          <div className="mt-5 flex items-start gap-3 rounded-[16px] bg-[#EAF4FB] p-4 text-left sm:p-5">
            <span className="mt-0.5 shrink-0 text-[#1A63B4]">
              <Info size={20} />
            </span>
            <p className="text-[13.5px] leading-7 text-[#1F1F1F] sm:text-[14.5px]">
              <strong>Gestión directa e independiente:</strong> en CRYBE cada
              profesional coordina su propia agenda de turnos. Podés consultar
              disponibilidad y agendar tu sesión con un solo clic a su WhatsApp
              personal.
            </p>
          </div>
        </motion.div>

        {/* FILTROS */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={`
                rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm transition-all min-h-[28px] sm:px-3 sm:py-2 sm:text-[12px] sm:min-h-[44px]
                ${
                  filtro === f.id
                    ? "bg-[#0F3A7A] text-white"
                    : "bg-white text-[#1F1F1F] hover:bg-[#EAF4FB]"
                }
              `}
            >
              {f.nombre}
            </button>
          ))}
        </div>

        {/* GRILLA */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {lista.map((profesional, index) => (
            <div
              key={profesional.id}
              className={`h-full ${
                index === lista.length - 1 ? "max-sm:col-span-2" : ""
              }`}
            >
              <TarjetaProfesional
                profesional={profesional}
                index={index}
                onVerPerfil={setPerfil}
              />
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE PERFIL */}
      <AnimatePresence>
        {perfil && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setPerfil(null)}
            className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#0A1830]/60 p-4 backdrop-blur-sm sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label={`Perfil de ${perfil.nombre}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto w-full max-w-[640px] overflow-visible rounded-[24px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-6"
            >
              {/* CERRAR */}
              <button
                type="button"
                onClick={() => setPerfil(null)}
                aria-label="Cerrar perfil"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4FB] text-[#0F3A7A] transition-colors hover:bg-[#0F3A7A] hover:text-white"
              >
                <X size={19} />
              </button>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-[#EAF4FB] shadow-[0_6px_18px_rgba(15,58,122,0.18)]">
                  <FotoConFallback
                    profesional={perfil}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="pr-10 sm:pr-10">
                  <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#1A63B4]">
                    {perfil.especialidad}
                  </span>
                  <h3 className="mt-1 font-titulo text-[24px] font-bold leading-tight text-[#1F1F1F]">
                    {perfil.nombre}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#6B7280]">
                    {perfil.matricula}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[14px] leading-7 text-[#3D3D3D]">
                {perfil.descripcion || perfil.resumen}
              </p>

              {(perfil.areas || []).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-titulo text-[18px] font-semibold text-[#1F1F1F]">
                    Formación profesional
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {perfil.areas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full bg-[#EAF4FB] px-4 py-1.5 text-[13px] font-medium text-[#1F1F1F]"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {perfil.mostrarHorarios && (perfil.dias || []).length > 0 && (
                <div className="mt-4 flex items-start gap-4 rounded-[18px] bg-[#F4F8FB] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0F3A7A] shadow-sm">
                    <CalendarDays size={20} />
                  </span>
                  <div>
                    <h4 className="font-titulo text-[17px] font-semibold text-[#1F1F1F]">
                      Días de atención
                    </h4>
                    <p className="mt-1 text-[14px] leading-6 text-[#4B5563]">
                      {perfil.dias.join(" · ")}
                    </p>
                    {perfil.horarios && (
                      <p className="text-[14px] leading-6 text-[#4B5563]">
                        {perfil.horarios}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <a
                href={`https://wa.me/${perfil.whatsapp}?text=${encodeURIComponent(`Hola ${perfil.nombre}, quiero consultar por un turno en CRYBE.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-5 flex w-fit items-center justify-center gap-2 self-center rounded-full
                  mx-auto bg-[#25D366] px-5 py-2 text-[12.5px] font-semibold text-white
                  shadow-[0_8px_22px_rgba(37,211,102,0.4)]
                  transition-all duration-300 hover:-translate-y-[2px] hover:brightness-95
                "
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.03h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" />
                </svg>
                Solicitar turno por WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Equipo;

