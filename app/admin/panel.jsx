"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Home,
  Inbox,
  Users,
  Megaphone,
  HeartHandshake,
  LayoutGrid,
  Phone,
  LogOut,
} from "lucide-react";
import {
  marcarLeido,
  eliminarContacto,
  cerrarSesion,
} from "./actions";
import EquipoAdmin from "./equipo-admin";
import NovedadesAdmin from "./novedades-admin";
import InicioAdmin from "./inicio-admin";
import NosotrosAdmin from "./nosotros-admin";
import EspecialidadesAdmin from "./especialidades-admin";
import DatosAdmin from "./datos-admin";

const SECCIONES = [
  { id: "inicio", label: "Inicio", icon: Home, desc: "Configura la portada del sitio: imagen, título y subtítulo por especialidad." },
  { id: "nosotros", label: "Nosotros", icon: HeartHandshake, desc: "Configurá la sección Nosotros: título, descripción e ítems (máx 8)." },
  { id: "especialidades", label: "Especialidades", icon: LayoutGrid, desc: "Configurá las tarjetas de Especialidades." },
  { id: "equipo", label: "Equipo", icon: Users, desc: "Profesionales: datos, fotos y visibilidad en el sitio." },
  { id: "novedades", label: "Recursos", icon: Megaphone, desc: "Blog y recursos para la comunidad." },
  { id: "consultas", label: "Bandeja de entrada", icon: Inbox, desc: "Mensajes que llegan del formulario de contacto." },
  { id: "datos", label: "Datos y redes", icon: Phone, desc: "Teléfonos, email, redes, dirección, horarios y contraseña." },
];

function fechaCorta(iso) {
  try {
    return new Date(iso).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

// Bandeja estilo email: filas con no leídos destacados, lector en modal.
function BandejaEntrada({ contactos }) {
  const [soloNoLeidos, setSoloNoLeidos] = useState(false);
  const [abiertoId, setAbiertoId] = useState(null);
  const [confirmar, setConfirmar] = useState(false);
  const [pendiente, start] = useTransition();

  const lista = useMemo(() => {
    const ordenados = [...(contactos || [])].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return soloNoLeidos ? ordenados.filter((c) => !c.leido) : ordenados;
  }, [contactos, soloNoLeidos]);

  const abierto = lista.find((c) => c.id === abiertoId) || null;
  const waAbierto = abierto
    ? `https://wa.me/549${String(abierto.telefono).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`Hola ${abierto.nombre}, te escribimos desde Centro CRYBE por tu consulta.`)}`
    : "";

  const abrir = (c) => {
    setAbiertoId(c.id);
    setConfirmar(false);
    if (!c.leido) start(async () => { await marcarLeido(c.id, true); });
  };

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {[
          { id: false, nombre: "Todos" },
          { id: true, nombre: "No leídos" },
        ].map((f) => (
          <button
            key={f.nombre}
            type="button"
            onClick={() => setSoloNoLeidos(f.id)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-semibold ${soloNoLeidos === f.id ? "bg-lila-900 text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-lila-500"}`}
          >
            {f.nombre}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-[14px] text-stone-500">
          Bandeja vacía.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-stone-200/70 bg-white">
          {lista.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => abrir(c)}
              className={`flex w-full items-center gap-3 border-b border-[#EEF2F7] px-4 py-3 text-left transition-colors last:border-0 hover:bg-lila-50/50 ${!c.leido ? "bg-lila-50/60" : ""}`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${!c.leido ? "bg-lila-700" : "bg-transparent"}`} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className={`truncate text-[14px] ${!c.leido ? "font-bold text-[#1F1F1F]" : "font-medium text-stone-600"}`}>
                    {c.nombre}
                  </span>
                  <span className="shrink-0 text-[11px] text-stone-400">{fechaCorta(c.created_at)}</span>
                </span>
                <span className="mt-0.5 block truncate text-[12.5px] text-stone-500">
                  <span className="font-semibold text-lila-700">{c.motivo}</span>
                  {" — "}{c.mensaje}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {abierto && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#0A1830]/60 p-4 backdrop-blur-sm sm:items-center" onClick={() => setAbiertoId(null)}>
          <div className="my-auto w-full max-w-[560px] rounded-[20px] bg-white p-5 shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-serif-display text-[22px] font-medium text-stone-800">{abierto.nombre}</h3>
                <p className="mt-0.5 text-[13px] text-stone-500">
                  {abierto.telefono}{abierto.email ? ` · ${abierto.email}` : ""} · {fechaCorta(abierto.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAbiertoId(null)}
                aria-label="Cerrar"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F3F9] text-[16px] text-stone-500 hover:bg-stone-200"
              >
                ×
              </button>
            </div>
            <p className="mt-3 inline-block rounded-full bg-lila-100 px-3 py-1 text-[11px] font-bold text-lila-900">{abierto.motivo}</p>
            <p className="mt-3 whitespace-pre-wrap text-[14px] leading-7 text-stone-700">{abierto.mensaje}</p>
            <div className="mt-4 flex flex-wrap gap-2" style={{ opacity: pendiente ? 0.6 : 1 }}>
              <a
                href={waAbierto}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-emerald-500"
              >
                Responder por WhatsApp
              </a>
              <button
                type="button"
                disabled={pendiente}
                onClick={() => start(async () => { await marcarLeido(abierto.id, !abierto.leido); })}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-[12px] font-semibold text-stone-600 hover:border-lila-500 hover:text-lila-900"
              >
                {abierto.leido ? "Marcar no leído" : "Marcar leído"}
              </button>
              {confirmar ? (
                <>
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => start(async () => { await eliminarContacto(abierto.id); setAbiertoId(null); })}
                    className="rounded-xl bg-red-600 px-4 py-2 text-[12px] font-semibold text-white"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmar(false)}
                    className="rounded-xl border border-stone-200 px-4 py-2 text-[12px] font-semibold text-stone-500"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmar(true)}
                  className="rounded-xl px-3 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Panel({ contactos, profesionales, novedades, especialidades, nosotros, ajustes, portadas }) {
  const [tab, setTab] = useState("inicio");

  // Cierre por inactividad: 5 min sin actividad => logout + aviso en el login.
  useEffect(() => {
    let t;
    const LIMITE_MS = 5 * 60 * 1000;
    const salir = async () => {
      try {
        await cerrarSesion("/admin/login?motivo=inactividad");
      } catch {
        window.location.href = "/admin/login?motivo=inactividad";
      }
    };
    const reiniciar = () => {
      clearTimeout(t);
      t = setTimeout(salir, LIMITE_MS);
    };
    const eventos = ["click", "keydown", "scroll", "mousemove", "touchstart"];
    eventos.forEach((e) => window.addEventListener(e, reiniciar, { passive: true }));
    reiniciar();
    return () => {
      clearTimeout(t);
      eventos.forEach((e) => window.removeEventListener(e, reiniciar));
    };
  }, []);

  const noLeidos = (contactos || []).filter((c) => !c.leido).length;
  const seccion = SECCIONES.find((s) => s.id === tab);

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-gradient-to-br from-[#E9F1F8] via-[#F4F8FB] to-[#E2EBF4] pb-10">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl flex-1 items-start gap-4 px-4 py-4 sm:px-5 md:grid-cols-[240px_minmax(0,1fr)]">
        {/* SIDEBAR */}
        <nav className="hidden min-w-0 space-y-1.5 self-start rounded-[20px] border border-white/60 bg-white/55 p-2.5 shadow-[0_8px_32px_rgba(61,52,99,0.08),0_2px_8px_rgba(61,52,99,0.06)] backdrop-blur-xl md:block">
          <div className="relative overflow-hidden rounded-[14px] px-3 pb-3.5 pt-4 text-center">
            {/* Marca de agua: decorativa, va detrás del texto y no se anuncia. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logoSinFondo.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
            />
            <h1 className="relative font-serif-display text-[17px] font-semibold leading-[1.15] tracking-tight text-lila-900">
              Panel de administración
            </h1>
            <p className="relative mt-1.5 text-[11.5px] font-semibold leading-snug text-stone-600">
              Manejá el contenido del sitio
            </p>
          </div>
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setTab(s.id); window.scrollTo({ top: 0 }); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition-all ${
                tab === s.id
                  ? "border border-lila-800/20 bg-lila-900 text-white shadow-[0_4px_16px_rgba(61,52,99,0.22)]"
                  : "border border-white/40 bg-white/70 text-stone-600 backdrop-blur-sm hover:border-lila-100 hover:bg-white/90 hover:text-lila-900 hover:shadow-sm"
              }`}
            >
              <s.icon size={18} className="shrink-0" />
              {s.label}
              {s.id === "consultas" && noLeidos > 0 && (
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${tab === s.id ? "bg-white/20 text-white" : "bg-lila-100 text-lila-900"}`}>
                  {noLeidos}
                </span>
              )}
            </button>
          ))}
          <div className="mt-1 border-t border-stone-200/50 pt-2">
            <button
              type="button"
              onClick={() => cerrarSesion()}
              className="flex w-full items-center gap-3 rounded-xl border border-white/30 bg-white/50 px-4 py-3 text-[13px] font-semibold text-red-600 backdrop-blur-sm transition-all hover:border-red-200 hover:bg-red-50/80 hover:text-red-700"
            >
              <LogOut size={18} className="shrink-0" /> Salir
            </button>
          </div>
        </nav>

        {/* CONTENIDO */}
        <div className="min-h-[360px] min-w-0 max-w-full overflow-hidden rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-[0_8px_32px_rgba(61,52,99,0.08)] backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif-display text-xl capitalize text-lila-900">{seccion?.label}</h2>
              <p className="mt-1 text-sm text-stone-500">{seccion?.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => cerrarSesion()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 transition-colors hover:text-red-700 md:hidden"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>

          {/* Tabs mobile */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 md:hidden">
            {SECCIONES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setTab(s.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${tab === s.id ? "bg-lila-900 text-white" : "bg-white text-stone-600 border border-stone-200"}`}
              >
                {s.label}{s.id === "consultas" && noLeidos > 0 ? ` (${noLeidos})` : ""}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {tab === "consultas" && <BandejaEntrada contactos={contactos} />}

            {tab === "equipo" && (
              <EquipoAdmin profesionales={profesionales} especialidades={especialidades} />
            )}

            {tab === "novedades" && <NovedadesAdmin novedades={novedades} profesionales={profesionales} />}

            {tab === "inicio" && <InicioAdmin portadas={portadas} />}

            {tab === "nosotros" && <NosotrosAdmin seccion={nosotros?.seccion} items={nosotros?.items} />}

            {tab === "especialidades" && <EspecialidadesAdmin especialidades={especialidades} />}

            {tab === "datos" && <DatosAdmin ajustes={ajustes} />}
          </div>
        </div>
      </div>
    </div>
  );
}
