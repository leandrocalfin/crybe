"use client";
import { motion } from "framer-motion";
import {
  Handshake,
  Brain,
  HeartHandshake,
  Sprout,
  Users,
  ClipboardCheck,
  Armchair,
  Network,
} from "lucide-react";
import { ICONOS } from "../../lib/iconos";

const pilares = [
  {
    icono: Handshake,
    titulo: "Acompañamiento",
    texto:
      "Un espacio donde puedas sentirte escuchado y acompañado durante cada etapa de tu proceso.",
  },
  {
    icono: Brain,
    titulo: "Enfoque integral",
    texto:
      "Profesionales de distintas áreas que pueden trabajar de manera complementaria según cada necesidad.",
  },
  {
    icono: Network,
    titulo: "Abordaje interdisciplinario",
    texto:
      "Realizamos ateneos clínicos y reuniones periódicas entre psicólogos, psicopedagogos, fonoaudiólogos y kinesiólogos para diseñar planes terapéuticos sinérgicos e integrados.",
  },
  {
    icono: Sprout,
    titulo: "Bienestar",
    texto:
      "Buscamos favorecer herramientas que contribuyan al desarrollo y bienestar de cada persona.",
  },
];

const complementarios = [
  {
    icono: Users,
    titulo: "Orientación familiar",
    texto:
      "Acompañamiento para padres y docentes que quieren ayudar mejor desde casa y la escuela.",
  },
  {
    icono: ClipboardCheck,
    titulo: "Evaluación diagnóstica",
    texto:
      "Evaluaciones ajustadas a cada situación. Identificamos el origen real antes de cualquier intervención.",
  },
  {
    icono: HeartHandshake,
    titulo: "Calidez humana y ética",
    texto:
      "Priorizamos la empatía activa, la escucha sin juzgar y el respeto absoluto a los tiempos de cada individuo y de su grupo familiar durante todo el tratamiento.",
  },
  {
    icono: Armchair,
    titulo: "Entornos tranquilos",
    texto:
      "Consultorios con iluminación natural, climatización individual y mobiliario específico para neurorehabilitación y juego simbólico.",
  },
];

const Nosotros = ({ titulo, parrafos, items }) => {
  // Si el admin cargó contenido en Supabase se usa eso; si no, datos locales.
  const lista = items?.length ? items : [...pilares, ...complementarios];
  const tituloFinal = titulo || "Un espacio cálido donde la salud mental y la rehabilitación convergen";
  const parrafosFinal = parrafos?.length
    ? parrafos
    : [
        "En CRYBE creemos que el bienestar se construye a través de un acompañamiento profesional, humano e integral. Somos un centro dedicado a la rehabilitación y al bienestar emocional, donde diferentes disciplinas trabajan de manera complementaria para acompañar las necesidades de cada persona.",
        "Nuestro objetivo es brindar un espacio de escucha, comprensión y acompañamiento, respetando los tiempos y particularidades de cada proceso.",
      ];

  const iconoDe = (p) => (typeof p.icono === "string" ? ICONOS[p.icono] || Sprout : p.icono);
  return (
    <section
      id="nosotros"
      data-navbar-color="#FFFFFF"
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-16"
      style={{
        background: "#FAFBFF",
      }}
    >
      {/* GRADIENTES LATERALES SUAVES */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-1/3 h-[380px] w-[380px] rounded-full bg-[#CDE8F7]/50 blur-[110px]" />
        <div className="absolute -right-28 top-1/4 h-[420px] w-[420px] rounded-full bg-[#D8EFFC]/60 blur-[120px]" />
        <div className="absolute left-1/2 top-0 h-[200px] w-[600px] -translate-x-1/2 rounded-full bg-[#EAF6FD]/70 blur-[100px]" />
      </div>

      {/* MARCA DE AGUA */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-start justify-center pt-28 md:pt-36">
        <img
          src="/marcaAgua.png"
          alt=""
          className="w-[min(90vw,700px)] opacity-[0.06] select-none"
          draggable={false}
        />
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        {/* ENCABEZADO CENTRADO — estilo referencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-[1000px] text-center sm:mb-12"
        >
          <p className="font-titulo text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0F3A7A] sm:text-[15px]">
            Nuestra propuesta
          </p>

          <h2 className="mt-2 font-titulo text-[28px] font-semibold leading-tight text-[#1F1F1F] sm:text-[34px] md:text-[42px]">
            {tituloFinal}
          </h2>

          {parrafosFinal.map((parrafo, i) => (
            <p
              key={i}
              className={`mx-auto max-w-[920px] text-[15px] leading-7 text-[#26262C] sm:text-[16px] ${i === 0 ? "mt-5" : "mt-3"}`}
            >
              {parrafo}
            </p>
          ))}
        </motion.div>

        {/* GRILLA DE PILARES — sin cards, líneas divisorias */}
        <div className="mx-auto grid max-w-[1150px] grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-8 sm:gap-y-10">
          {lista.map((p, i) => {
            const Icono = iconoDe(p);
            return (
              <motion.div
                key={p.titulo + i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: (i % 8) * 0.08 }}
                className="group border-t border-[#0F3A7A]/10 pt-5 text-left sm:pt-7"
              >
                <span className="flex items-center gap-2.5 sm:gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#DCEFFB] to-[#9FD6F3] text-[#0F3A7A] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-11 sm:w-11">
                    <Icono size={18} strokeWidth={1.8} />
                  </span>
                  <h3 className="text-[14.5px] font-semibold leading-snug text-[#1F1F1F] transition-colors duration-300 group-hover:text-[#0F3A7A] sm:text-[15.5px]">
                    {p.titulo}
                  </h3>
                </span>

                <p className="mt-2 text-[12.5px] leading-6 text-[#333A45] sm:mt-3 sm:text-[13.5px] sm:leading-6">
                  {p.texto}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Nosotros;

