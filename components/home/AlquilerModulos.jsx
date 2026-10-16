"use client";
import { motion } from "framer-motion";
import {
  DoorOpen,
  Check,
  Network,
} from "lucide-react";

const modulos = [
  "Habilitación sanitaria vigente para psicología, psicopedagogía, fono y afines.",
  "Sala de espera acogedora con música ambiental y recepción de pacientes.",
  "Office & Cocina exclusiva para profesionales (café, microondas, frigobar).",
  "Wi-Fi simétrico corporativo para historias clínicas y sesiones virtuales.",
];

const AlquilerModulos = () => {
  return (
    <section
      id="alquiler-de-modulos"
      data-navbar-color="#e2e7ff"
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-16"
      style={{ background: "#e2e7ff" }}
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-8 max-w-[780px] text-center sm:mb-10"
        >
          <p className="font-titulo text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0F3A7A] sm:text-[15px]">
            Comunidad Profesional CryBE
          </p>
          <h2 className="mt-2 font-titulo text-[26px] font-semibold leading-tight text-[#1F1F1F] sm:text-[30px] md:text-[38px]">
            Infraestructura y Red para Profesionales de la Salud
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-7 text-[#26262C] sm:text-[16px]">
            Ofrecemos un entorno cuidado, habilitado y colaborativo donde
            desarrollar tu práctica profesional con excelencia e independencia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-10 md:gap-y-0 lg:gap-x-14">
          {/* BLOQUE 1: ALQUILER */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between md:pr-8 lg:pr-12"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F3A7A]/15 bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-[#0F3A7A] backdrop-blur sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[11px] md:text-[12px]">
                <DoorOpen size={14} />
                Alquiler por Módulos y Horas
              </span>
              <h3 className="mt-2.5 font-titulo text-[16.5px] font-semibold leading-tight text-[#1F1F1F] sm:mt-3 sm:text-[21px] md:text-[21px] lg:text-[28px]">
                Consultorios Completamente Equipados
              </h3>
              <p className="mt-2 text-[12.5px] leading-5 text-[#333A45] sm:mt-3 sm:text-[14px] sm:leading-7 lg:text-[15px]">
                Elegí la cantidad de módulos semanales que mejor se ajusten a
                tu agenda. Espacios climatizados, habilitados y diseñados para
                confort acústico y clínico.
              </p>
              <ul className="mb-4 mt-3 space-y-2 sm:mb-6 sm:mt-4 sm:space-y-3">
                {modulos.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 text-[#1A63B4]">
                      <Check size={15} strokeWidth={2.5} />
                    </span>
                    <span className="text-[12px] leading-5 text-[#1F1F1F] sm:text-[14px] sm:leading-6">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* BLOQUE 2: SUMATE */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-between"
          >
            <div>
              <h3 className="font-titulo text-[16.5px] font-semibold leading-tight text-[#1F1F1F] sm:text-[21px] md:text-[21px] lg:text-[28px]">
                ¿Querés Formar Parte del Staff CryBE?
              </h3>
              <div className="mt-2.5 rounded-[22px] bg-white p-2 shadow-[0_2px_16px_rgba(30,40,80,0.08)] sm:mt-4">
                <img
                  src="/nosotros.png"
                  alt="Espacios de CRYBE"
                  loading="lazy"
                  className="h-32 w-full rounded-[16px] object-cover sm:h-[180px] lg:h-[220px]"
                />
              </div>
              <div className="mt-2.5 sm:mt-4">
                <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F3A7A] sm:gap-2 sm:text-[14px]">
                  <Network size={16} className="shrink-0" />
                  Beneficios de Integrarte:
                </p>
                <p className="mt-2 text-[12px] leading-5 text-[#333A45] sm:text-[14px] sm:leading-6">
                  Derivaciones cruzadas continuas entre el equipo, ateneos de
                  interconsulta clínica, difusión institucional de tu perfil en
                  nuestras plataformas y ambiente de respeto y crecimiento
                  mutuo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <a
            href="#contacto"
            className="inline-flex w-auto items-center justify-center rounded-xl bg-[#0F3A7A] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_8px_22px_rgba(15,58,122,0.3)] transition-all hover:-translate-y-[2px] hover:brightness-110 sm:px-5 sm:py-3 sm:text-[13px]"
          >
            Consultar Disponibilidad de Módulos
          </a>
        </div>
      </div>
    </section>
  );
};

export default AlquilerModulos;

