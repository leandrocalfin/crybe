"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CalendarDays } from "lucide-react";

import { especialidadesHero } from "../../data/especialidades";

const Hero = ({ slides }) => {
  // Si el admin cargó contenido en Supabase se usa eso; si no, datos locales.
  const lista = slides?.length ? slides : especialidadesHero;
  const [actual, setActual] = useState(0);

  const slide = lista[actual] || especialidadesHero[0];

  // Evita que la última palabra quede sola + respeta \n manuales
  const renderTitulo = (texto) => {
    return texto.split("\n").map((linea, i, arr) => (
      <span key={i}>
        {linea}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };
  const descripcionSinViuda = slide.descripcion.replace(/ (\S+)$/, " $1");

  useEffect(() => {
    if (lista.length <= 1) return;
    const intervalo = setInterval(() => {
      setActual((prev) => (prev === lista.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(intervalo);
  }, [lista.length]);

  // Precarga la imagen del siguiente slide para que el crossfade sea fluido.
  // Solo precarga (no renderiza): antes se montaban DOS carruseles a la vez
  // (desktop + mobile, uno oculto con CSS pero igual animando) y cada uno con
  // zoom continuo de 8s. Eso mantenía la GPU trabajando siempre y en tablet
  // se arrastraba todo el scroll.
  useEffect(() => {
    if (lista.length <= 1) return;
    const siguiente = lista[(actual + 1) % lista.length];
    if (!siguiente?.imagen) return;
    const img = new Image();
    img.decoding = "async";
    img.src = siguiente.imagen;
  }, [actual, lista]);

  // Precarga al montar la primera imagen (alocacion rápida del primer render)
  useEffect(() => {
    if (!lista[0]?.imagen) return;
    const img = new Image();
    img.decoding = "async";
    img.src = lista[0].imagen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="inicio"
      data-navbar-color="#F4F8FB"
      className="relative flex min-h-[100svh] flex-col overflow-hidden max-lg:pt-[124px] lg:pt-[170px] max-lg:bg-[#F4F8FB] max-lg:min-h-0"
    >
      {/* FONDO — una sola capa para todos los breakpoints. Antes había dos
          (desktop + mobile) montadas a la vez con crossfade y zoom continuo
          cada una: doble descarga y doble animación permanente. La posición
          del encuadre se ajusta solo con CSS.
          En mobile/tablet arranca DEBAJO del navbar (como antes): si la foto
          sigue hasta arriba se nota el corte de tono contra el navbar. */}
      <div className="absolute inset-0 max-lg:top-[124px]">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide.id}
            src={slide.imagen}
            alt={slide.nombre}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 h-full w-full object-cover object-[50%_20%] md:object-[50%_35%] lg:object-[50%_35%] xl:object-[50%_20%] 2xl:object-center"
          />
        </AnimatePresence>

        {/* OVERLAY lateral — solo desktop: en mobile/tablet la foto va limpia,
            solo con degradado blanco arriba (fundido al navbar) y abajo
            (fundido al fondo). */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-white/90 via-white/45 via-35% to-transparent sm:from-white/85 sm:via-white/35 sm:via-40% lg:block" />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(205,190,240,0.16) 0%, rgba(205,190,240,0.0) 20%, rgba(255,255,255,0.0) 55%, rgba(255,255,255,0.0) 100%)",
          }}
        />

        {/* GLOW solo en desktop: el blur grande fijo es de lo más caro en GPU móvil */}
        <div className="absolute -left-24 top-1/4 hidden h-[320px] w-[320px] rounded-full bg-[#E6D9F7]/35 blur-3xl sm:-left-16 lg:block" />
      </div>

      {/* CONTENIDO — en mobile: imagen de fondo + texto superpuesto; tablet/desktop: texto a la izquierda */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-12 lg:items-center lg:justify-center lg:px-20 xl:px-24 max-lg:flex-none max-lg:h-[62vh] max-lg:min-h-[330px] max-lg:justify-start max-lg:py-4">
        {/* VELOS solo en mobile para fundir la foto con el fondo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-t from-[#f2f3ff] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-white/25 via-white/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-white/25 via-white/10 to-transparent" />
          {/* Este llega hasta la mitad de la foto y con from-white/55 dejaba el título
              embargado: el texto se perdía contra ese blanco. Acortado a h-[16%]
              y más suave, cubre solo el navbar y deja el hero limpio. */}
          <div className="absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-white/45 via-white/15 to-transparent" />
        </div>

        {/* TEXTO + BOTONES */}
        <div className="relative flex w-full flex-col items-center justify-center text-center lg:items-start lg:text-left">
          <div className="w-full max-w-[800px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="min-h-[170px] sm:min-h-[250px] md:min-h-[295px]"
              >
                <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#0F3A7A] sm:mb-3 sm:text-[15px] md:text-[15px]">
                  {slide.nombre}
                </p>

                <h1 className="font-titulo min-h-[2.4em] max-w-[780px] text-[22px] font-bold leading-[1.12] tracking-[-0.02em] text-[#1F1F1F] sm:text-[36px] sm:leading-[1.1] md:text-[40px] lg:text-[52px] xl:text-[56px] max-lg:max-w-none max-lg:w-full max-lg:min-h-[1.9em]">
                  {renderTitulo(slide.titulo)}
                </h1>

                <p className="mt-3 hidden max-w-[500px] text-[13px] font-medium leading-6 text-[#2B2B2B] lg:block lg:text-[15px] md:text-base">
                  {descripcionSinViuda}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* BOTONES — abajo de la imagen en mobile */}
        <div className="relative mt-6 flex w-full flex-col items-center justify-center gap-2.5 lg:flex-row lg:items-center lg:justify-start max-lg:mt-auto max-lg:gap-1.5 max-lg:py-3">
              <p className="mb-1 max-w-[480px] text-center text-[12px] font-medium leading-5 text-[#2B2B2B] max-lg:line-clamp-2 max-lg:block lg:hidden">
                {descripcionSinViuda}
              </p>
              <a
                href="#equipo"
                style={{
                  background:
                    "linear-gradient(90deg, #0F3A7A 0%, #2AA3D5 50%, #0F3A7A 100%)",
                  color: "#FFFFFF",
                }}
                className="
                  inline-flex w-fit items-center justify-center gap-2
                  rounded-full
                  px-4 py-1.5
                  text-[12px] font-semibold
                  min-h-9
                  shadow-[0_8px_22px_rgba(15,58,122,0.35)]
                  transition-all duration-300
                  hover:-translate-y-[2px]
                  hover:brightness-110
                  max-lg:max-w-full max-lg:min-h-8 max-lg:px-3 max-lg:py-1 max-lg:text-[11px]
                "
              >
                <CalendarDays size={15} className="max-lg:size-[13px]" />
                Agendar Turno con un Profesional
              </a>
              <a
                href="#especialidades"
                className="
                  inline-flex w-fit items-center justify-center gap-2
                  rounded-full
                  border border-[#0F3A7A]/25
                  bg-white/80
                  px-4 py-1.5
                  text-[12px] font-semibold text-[#0F3A7A]
                  min-h-9
                  backdrop-blur
                  transition-all duration-300
                  hover:-translate-y-[2px]
                  hover:border-[#0F3A7A]/60 hover:bg-white
                  max-lg:max-w-full max-lg:min-h-8 max-lg:px-3 max-lg:py-1 max-lg:text-[11px]
                "
              >
                Ver especialidades
              </a>
              <a
                href="#alquiler-de-modulos"
                className="
                  inline-flex w-fit items-center justify-center gap-2
                  rounded-full
                  border border-[#0F3A7A]/25
                  bg-white/80
                  px-4 py-1.5
                  text-[12px] font-semibold text-[#0F3A7A]
                  min-h-9
                  backdrop-blur
                  transition-all duration-300
                  hover:-translate-y-[2px]
                  hover:border-[#0F3A7A]/60 hover:bg-white
                  max-lg:max-w-full max-lg:min-h-8 max-lg:px-3 max-lg:py-1 max-lg:text-[11px]
                "
              >
                <Building2 size={15} className="max-lg:size-[13px]" />
                Alquiler de Módulos
              </a>
            </div>

        {/* INDICADORES FIJOS */}
        <div className="relative mt-6 flex w-full items-center justify-center gap-1.5 sm:mt-5 lg:justify-start max-lg:mt-3">
          {lista.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActual(index)}
              aria-label={`Mostrar ${item.nombre}`}
              className={`h-[1.5px] rounded-full transition-all duration-500 ${
                actual === index
                  ? "w-6 bg-[#2AA3D5]"
                  : "w-[1.5px] bg-[#2AA3D5]/30 hover:bg-[#2AA3D5]/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;


