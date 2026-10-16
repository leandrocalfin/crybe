"use client";
import { motion } from "framer-motion";

const especialidades = [
  {
    slug: "psiquiatria",
    nombre: "Psiquiatría",
    tag: "Jóvenes y Adultos",
    descripcion:
      "Evaluación médica en salud mental, diagnóstico diferencial, psicofarmacología responsable y monitoreo regular en articulación permanente con el psicólogo tratante.",
    imagen: "/psiquiatria2.jpg",
  },
  {
    slug: "psicologia",
    nombre: "Psicología",
    tag: "Niños, Jóvenes y Adultos",
    descripcion:
      "Terapia individual para niños, adolescentes y adultos. Abordajes de pareja y familias bajo perspectivas cognitivo-conductual, sistémica y psicoanalítica relacional.",
    imagen: "/psicologia.webp",
  },
  {
    slug: "psicopedagogia",
    nombre: "Psicopedagogía",
    tag: "Infancias y Adolescentes",
    descripcion:
      "Evaluación neurocognitiva y diagnóstico, tratamiento de desafíos del aprendizaje, orientación institucional escolar y estimulación de funciones ejecutivas.",
    imagen: "/psicopedagogia2.jpg",
  },
  {
    slug: "fonoaudiologia",
    nombre: "Fonoaudiología",
    tag: "Todas las edades",
    descripcion:
      "Rehabilitación foniátrica de la voz, dificultades del habla, trastornos del lenguaje expresivo/comprensivo, disfagia y estimulación temprana orofacial.",
    imagen: "/fonoaudiologia.webp",
  },
  {
    slug: "kinesiologia-psicomotricidad",
    nombre: "Kinesiología y Psicomotricidad",
    tag: "Rehabilitación física",
    descripcion:
      "Integración de las funciones motrices y psíquicas a través del juego, la exploración espacial, la coordinación corporal y la autorregulación emocional.",
    imagen: "/Kinesiologia.webp",
  },
];

const Especialidades = ({ items, titulo, descripcion }) => {
  const lista = items?.length ? items : especialidades;
  return (
    <section
      id="especialidades"
      data-navbar-color="#f2f3ff"
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-16"
      style={{ background: "#f2f3ff" }}
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-[680px] text-center sm:mb-12"
        >
          <p className="font-titulo text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0F3A7A] sm:text-[15px]">
            Especialidades
          </p>
          <h3 className="mt-2 font-titulo text-[26px] font-semibold leading-tight text-[#1F1F1F] sm:text-[30px] md:text-[38px]">
            {titulo || "Acompañamiento para cada etapa"}
          </h3>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-7 text-[#26262C] sm:text-[16px]">
            {descripcion || "Un equipo interdisciplinario que trabaja de forma complementaria según las necesidades de cada persona."}
          </p>
        </motion.div>

        {/* GRID — estilo referencia: imagen completa + título abajo, hover muestra descripción */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 lg:gap-6">
          {lista.map((esp, i) => (
            <motion.div
              key={esp.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
              className="group relative aspect-square w-[calc(50%-6px)] overflow-hidden rounded-none bg-white p-1 shadow-[0_2px_16px_rgba(30,40,80,0.08)] ring-1 ring-[#0F3A7A]/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,58,122,0.22)] sm:w-[calc(50%-10px)] lg:w-[270px] xl:w-[285px]"
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={esp.imagen}
                  alt={esp.nombre}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 285px"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 will-change-auto"
                />
                {/* Título siempre visible abajo izquierda */}
                <div className="absolute bottom-4 left-0 bg-black/60 px-2 py-1 transition-opacity duration-300 group-hover:opacity-0 sm:bottom-6 sm:px-3 sm:py-1.5">
                  <h4 className="font-titulo text-[11px] font-semibold leading-snug text-white sm:text-[16px]">
                    {esp.nombre}
                  </h4>
                </div>
                {/* Overlay hover con descripción */}
                <div className="absolute inset-0 flex flex-col justify-end bg-[#0F3A7A]/90 p-3 opacity-0 transition-all duration-400 group-hover:opacity-100 sm:p-5">
                  {esp.tag && (
                    <span className="w-fit bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {esp.tag}
                    </span>
                  )}
                  <h4 className="mt-2 font-titulo text-[17px] font-semibold text-white">
                    {esp.nombre}
                  </h4>
                  <p className="mt-1.5 translate-y-2 text-[12.5px] leading-5 text-white/90 transition-transform duration-400 group-hover:translate-y-0">
                    {esp.descripcion}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Especialidades;
