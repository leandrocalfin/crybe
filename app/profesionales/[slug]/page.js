import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { profesionales } from "../../../data/profesionales";
import { getSupabaseBrowser } from "../../../lib/supabase";
import { getAdminUser } from "../../../lib/supabaseServer";
import Navbar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import WhatsApp from "../../../components/layout/WhatsApp";

import { createClient } from "@supabase/supabase-js";

export async function generateStaticParams() {
  const locales = profesionales
    .filter((p) => p.activo !== false)
    .map((p) => ({ slug: p.slug }));
  // Suma los creados desde /admin (si Supabase responde).
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const sb = createClient(url, key);
      const { data } = await sb.from("profesionales").select("slug").eq("activo", true);
      const extra = (data || [])
        .filter((p) => !locales.some((l) => l.slug === p.slug))
        .map((p) => ({ slug: p.slug }));
      return [...locales, ...extra];
    }
  } catch {
    // Fallback: solo locales.
  }
  return locales;
}

async function getAjustes() {
  try {
    const supabase = getSupabaseBrowser();
    if (!supabase) return null;
    const { data } = await supabase.from("ajustes").select("*");
    const mapa = {};
    (data || []).forEach((a) => { mapa[a.clave] = a.valor || ""; });
    return mapa;
  } catch {
    return null;
  }
}

async function getProfesional(slug) {
  // 1) Intentar Supabase (cuando esté configurado)
  const supabase = getSupabaseBrowser();
  if (supabase) {
    const { data } = await supabase
      .from("profesionales")
      .select("*")
      .eq("slug", slug)
      .eq("activo", true)
      .maybeSingle();
    if (data) {
      return {
        slug: data.slug,
        nombre: data.nombre,
        especialidad: data.especialidad,
        matricula: data.matricula,
        descripcion: data.descripcion,
        resumen: data.resumen,
        foto: data.foto_url,
        dias: data.dias || [],
        horarios: data.horarios || "",
        mostrarHorarios: data.mostrar_horarios,
        areas: data.areas || [],
      };
    }
  }
  // 2) Fallback local (datos migrados)
  return profesionales.find((item) => item.slug === slug) || null;
}

export default async function ProfesionalPage({ params }) {
  const { slug } = await params;
  const [profesional, ajustes, sesion] = await Promise.all([
    getProfesional(slug),
    getAjustes(),
    getAdminUser().catch(() => ({ user: null, isAdmin: false })),
  ]);

  if (!profesional) notFound();

  return (
    <>
      <Navbar
        adminEmail={sesion.isAdmin ? sesion.user?.email : null}
        adminAvatar={ajustes?.avatar || ""}
      />
      <main className="min-h-screen bg-white px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-[#1F1F1F] sm:text-[14px]"
          >
            ← Volver
          </Link>

          <div className="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="overflow-hidden rounded-t-[100px] rounded-b-[24px] bg-[#D8E5F1] sm:rounded-t-[130px] sm:rounded-b-[28px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profesional.foto}
                alt={profesional.nombre}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#665E46] sm:text-[13px]">
                {profesional.especialidad}
              </span>
              <h1 className="mt-3 font-titulo text-[32px] font-semibold leading-tight text-[#1F1F1F] sm:text-[38px] md:text-[42px] lg:text-[54px]">
                {profesional.nombre}
              </h1>
              <p className="mt-2 text-[13px] text-[#73787B] sm:text-[14px]">
                {profesional.matricula || profesional.especialidad}
              </p>
              <p className="mt-6 max-w-[650px] text-[15px] leading-7 text-[#5F5F5F] sm:text-base">
                {profesional.descripcion || profesional.resumen}
              </p>

              {(profesional.areas || []).length > 0 && (
                <div className="mt-8">
                  <h2 className="font-titulo text-[22px] font-semibold text-[#1F1F1F] sm:text-[25px]">
                    Formación profesional
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {(profesional.areas || []).map((area) => (
                      <span
                        key={area}
                        className="rounded-full bg-[#D8E5F1] px-3 py-1.5 text-[12px] font-medium text-[#1F1F1F] sm:px-4 sm:py-2 sm:text-[13px]"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profesional.mostrarHorarios && (profesional.dias || []).length > 0 && (
                <div className="mt-8 rounded-[22px] bg-[#F1F3F5] p-5 sm:p-7">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1F1F1F] sm:h-11 sm:w-11">
                      <CalendarDays size={19} />
                    </div>
                    <div>
                      <h2 className="font-titulo text-[19px] font-semibold text-[#1F1F1F] sm:text-[22px]">
                        Días de atención
                      </h2>
                      <p className="mt-2 text-[13px] leading-6 text-[#5F5F5F] sm:text-[14px]">
                        {(profesional.dias || []).join(" · ")}
                      </p>
                      <p className="text-[13px] leading-6 text-[#5F5F5F] sm:text-[14px]">
                        {profesional.horarios}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <a
                href="/#contacto"
                className="mt-8 inline-flex w-full sm:w-auto rounded-full bg-[#2B2B2B] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_8px_22px_rgba(0,0,0,0.14)] sm:px-7 sm:py-3.5 sm:text-[14px]"
              >
                Solicitar turno
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer ajustes={ajustes} />
      <WhatsApp numero={ajustes?.whatsapp} />
    </>
  );
}
