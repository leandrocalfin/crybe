"use client";
import { useState } from "react";
import Link from "next/link";

import {
  CalendarDays,
} from "lucide-react";

const FONDO_CARD = "#FFFFFF";

const ProfesionalCard = ({ profesional }) => {
  const apellido =
    profesional.nombre?.trim().split(/\s+/).pop() || "";

  const [fotoSrc, setFotoSrc] = useState(`/${apellido}.png`);

  const waLink = `https://wa.me/${profesional.whatsapp}?text=${encodeURIComponent(`Hola ${profesional.nombre}, quiero reservar un turno.`)}`;

  return (
    <article
      className="
        group
        flex
        h-full
        w-full
        flex-col
        overflow-hidden
        rounded-[14px]
        sm:rounded-[20px]
        border border-[#D5E0EE]
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_24px_50px_-16px_rgba(15,58,122,0.35)]
        shadow-[0_12px_32px_-8px_rgba(30,40,80,0.28)]
      "
      style={{ backgroundColor: FONDO_CARD }}
    >
      {/* FOTO con onda */}
      <Link
        href={`/profesionales/${profesional.slug}`}
        className="relative block overflow-hidden bg-[#DCEBF5]"
        aria-label={`Ver perfil de ${profesional.nombre}`}
      >
        <img
          src={fotoSrc}
          onError={() => {
            if (fotoSrc !== profesional.foto) {
              setFotoSrc(profesional.foto);
            }
          }}
          alt={profesional.nombre}
          loading="lazy"
          className="
            aspect-[1/0.88]
            w-full
            bg-[#DCEBF5]
            object-cover
            object-top
          "
        />

        <svg
          viewBox="0 0 400 56"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute -bottom-[3px] left-0 z-10 block h-6 w-full sm:h-[38px]"
        >
          <path
            d="M0,34 C90,58 180,58 265,30 C320,12 360,14 400,26 L400,56 L0,56 Z"
            fill={FONDO_CARD}
          />
        </svg>
      </Link>

      {/* INFORMACIÓN */}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-1 sm:px-4 sm:pb-3.5 sm:pt-1.5">
        <span className="inline-flex w-fit max-w-full items-center self-center rounded-full bg-[#EAF4FB] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#0F3A7A] truncate sm:px-3 sm:text-[9px] sm:tracking-[0.14em]">
          {profesional.especialidad}
        </span>

        <h3 className="mt-1 min-w-0 text-center font-titulo text-[13px] font-bold leading-[1.15] tracking-tight text-[#1F1F1F] [overflow-wrap:anywhere] sm:mt-1.5 sm:text-[16px] lg:text-[18px]">
          <Link
            href={`/profesionales/${profesional.slug}`}
            className="transition-colors hover:text-[#1A63B4]"
          >
            {profesional.nombre}
          </Link>
        </h3>

        <p className="mt-1 line-clamp-2 min-h-[32px] text-center text-[10.5px] leading-4 text-[#6B7280] [overflow-wrap:anywhere] sm:min-h-[40px] sm:text-[12px] sm:leading-5">
          {profesional.resumen}
        </p>

        <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:gap-2 sm:pt-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background:
                "linear-gradient(90deg, #1A63B4 0%, #2AA3D5 100%)",
              color: "#FFFFFF",
            }}
            className="
              inline-flex w-full items-center justify-center gap-1 rounded-full
              px-2 py-1 text-[9.5px] font-bold
              shadow-[0_8px_22px_rgba(42,163,213,0.40)]
              transition-all duration-300
              hover:-translate-y-[2px] hover:brightness-110
              sm:w-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-[13px]
            "
          >
            <CalendarDays size={12} className="sm:hidden" />
            <CalendarDays size={16} className="hidden sm:inline" />
            Reservar turno
          </a>

          <Link
            href={`/profesionales/${profesional.slug}`}
            className="
              inline-flex w-full items-center justify-center rounded-full
              border border-[#0F3A7A]/20
              px-2 py-1
              text-[10.5px] font-semibold text-[#0F3A7A]
              transition-all duration-300
              hover:border-[#0F3A7A]/50 hover:bg-[#EAF4FB]
              sm:w-auto sm:px-4 sm:py-1.5 sm:text-[12.5px]
            "
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProfesionalCard;


