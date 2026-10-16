"use client";
import {
  HeartHandshake,
  CircleDot,
  Network,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const pilares = [
  {
    titulo: "Acompañamiento",
    descripcion:
      "Cada proceso es único. Acompañamos con escucha, respeto y cercanía en cada etapa.",
    icono: HeartHandshake,
    fondo: "#D1E9F6",
    color: "#4B626C",
  },
  {
    titulo: "Mirada integral",
    descripcion:
      "Comprendemos a cada persona considerando sus necesidades, fortalezas y contexto.",
    icono: CircleDot,
    fondo: "#EEE2C3",
    color: "#665E46",
  },
  {
    titulo: "Interdisciplina",
    descripcion:
      "Distintas especialidades se complementan para construir un acompañamiento más completo.",
    icono: Network,
    fondo: "#EECAD5",
    color: "#705955",
  },
  {
    titulo: "Confianza",
    descripcion:
      "Construimos vínculos y espacios seguros para cada persona y su familia.",
    icono: ShieldCheck,
    fondo: "#F3EAFF",
    color: "#4B626C",
  },
];

const Pilares = () => {
  return (
    <section className="bg-[#FEF7FF] px-5 py-20 md:px-16 md:py-28">
      <div className="mx-auto max-w-[1280px]">

        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-[700px] text-center"
        >
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.14em] text-[#665E46]">
            Nuestros pilares
          </span>

          <h2 className="font-display text-[36px] font-semibold leading-[1.2] text-[#4B626C] md:text-[46px]">
            Lo que guía nuestra forma de acompañar.
          </h2>

          <p className="mx-auto mt-5 max-w-[600px] text-base leading-7 text-[#5F696D]">
            Una mirada humana, cercana e interdisciplinaria que pone a cada
            persona en el centro de su proceso.
          </p>
        </motion.div>

        {/* PILARES */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {pilares.map((pilar, index) => {
            const Icono = pilar.icono;

            return (
              <motion.article
                key={pilar.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                }}
                className="group text-center"
              >
                <div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full transition duration-300 group-hover:-translate-y-1"
                  style={{ backgroundColor: pilar.fondo }}
                >
                  <Icono
                    size={36}
                    strokeWidth={1.4}
                    style={{ color: pilar.color }}
                  />
                </div>

                <h3 className="mt-7 font-display text-[24px] font-semibold text-[#4B626C]">
                  {pilar.titulo}
                </h3>

                <p className="mx-auto mt-4 max-w-[260px] text-[15px] leading-7 text-[#5F696D]">
                  {pilar.descripcion}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pilares;
