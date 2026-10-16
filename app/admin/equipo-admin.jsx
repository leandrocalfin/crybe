"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { guardarProfesional, eliminarProfesional, toggleProfesional } from "./actions";
import FotoField from "./foto-field";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const inputCls = "h-9 w-full rounded-xl border border-stone-200 bg-white px-3 text-[14px] text-[#1F1F1F] outline-none focus:bg-lila-100";
const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-lila-500";
const areaCls = "w-full rounded-xl border border-stone-200 bg-white p-2.5 text-[14px] outline-none focus:bg-lila-100 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500";

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(lic|dr|dra|mg|esp)\.?\s+/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function EditorProfesional({ inicial, especialidades, count, onCerrar, onGuardado }) {
  const esNuevo = !inicial?.id;
  const [form, setForm] = useState(() => ({
    nombre: inicial?.nombre || "",
    especialidad: inicial?.especialidad || "",
    especialidad_slug: inicial?.especialidad_slug || "",
    modalidad: inicial?.modalidad || "Atención presencial",
    foto_url: inicial?.foto_url || "",
    matricula: inicial?.matricula || "",
    resumen: inicial?.resumen || "",
    descripcion: inicial?.descripcion || "",
    whatsapp: inicial?.whatsapp || "549",
    dias: inicial?.dias || [],
    horarios: inicial?.horarios || "",
    mostrar_horarios: inicial?.mostrar_horarios ?? true,
    activo: inicial?.activo ?? true,
  }));
  const [areas, setAreas] = useState(inicial?.areas || []);
  const [editando, setEditando] = useState(esNuevo);
  const [borrando, setBorrando] = useState(false);
  const [msg, setMsg] = useState("");
  const [pendiente, start] = useTransition();

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const dis = "disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500";

  const revertir = () => {
    setForm({
      nombre: inicial?.nombre || "",
      especialidad: inicial?.especialidad || "",
      especialidad_slug: inicial?.especialidad_slug || "",
      modalidad: inicial?.modalidad || "Atención presencial",
      foto_url: inicial?.foto_url || "",
      matricula: inicial?.matricula || "",
      resumen: inicial?.resumen || "",
      descripcion: inicial?.descripcion || "",
      whatsapp: inicial?.whatsapp || "549",
      dias: inicial?.dias || [],
      horarios: inicial?.horarios || "",
      mostrar_horarios: inicial?.mostrar_horarios ?? true,
      activo: inicial?.activo ?? true,
    });
    setAreas(inicial?.areas || []);
    setMsg("");
    setBorrando(false);
    setEditando(false);
  };

  const onGuardar = () => {
    setMsg("");
    if (form.nombre.trim().length < 2) {
      setMsg("El nombre es obligatorio.");
      return;
    }
    if (!form.especialidad_slug) {
      setMsg("Elegí la especialidad.");
      return;
    }
    const areasFinal = areas.map((a) => a.trim()).filter(Boolean);
    start(async () => {
      try {
        await guardarProfesional({
          ...(esNuevo ? { slug: slugify(form.nombre) } : { id: inicial.id, slug: inicial.slug }),
          ...form,
          nombre: form.nombre.trim(),
          orden: inicial?.orden ?? count ?? 0,
          areas: areasFinal,
        });
        setMsg("Guardado ✓");
        onGuardado?.();
      } catch (err) {
        setMsg(err?.message || "No se pudo guardar.");
      }
    });
  };

  const onBorrar = () => {
    setMsg("");
    start(async () => {
      try {
        await eliminarProfesional(inicial.id);
        onCerrar();
      } catch (err) {
        setMsg(err?.message || "No se pudo eliminar.");
        setBorrando(false);
      }
    });
  };

  return (
    <div className="border-t border-stone-200/70 px-4 py-4">
      {!esNuevo && (
        <div className="mb-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => (editando ? revertir() : setEditando(true))}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition ${editando ? "bg-red-600 text-white hover:brightness-110" : "bg-lila-100 text-lila-900 hover:bg-lila-200"}`}
          >
            ✎ {editando ? "Cancelar" : "Editar"}
          </button>
          {borrando ? (
            <>
              <button
                type="button"
                disabled={pendiente}
                onClick={onBorrar}
                className="rounded-xl bg-red-600 px-3 py-2 text-[11px] font-semibold text-white"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setBorrando(false)}
                className="rounded-xl border border-stone-200 px-3 py-2 text-[11px] font-semibold text-stone-500"
              >
                No
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setBorrando(true)}
                className="rounded-xl border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50"
              >
                Eliminar
              </button>
              {!esNuevo && (
                <button
                  type="button"
                  disabled={pendiente}
                  onClick={() => start(async () => {
                    await toggleProfesional(inicial.id, !inicial.activo);
                    setForm((p) => ({ ...p, activo: !inicial.activo }));
                  })}
                  className={`rounded-xl px-3 py-2 text-[11px] font-semibold ${inicial.activo ? "bg-green-100 text-green-900" : "bg-gray-200 text-gray-600"}`}
                >
                  {inicial.activo ? "Visible" : "Oculto"}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {borrando && !esNuevo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0A1830]/60 p-4 backdrop-blur-sm" onClick={() => setBorrando(false)}>
          <div className="w-full max-w-[360px] rounded-[20px] bg-white p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif-display text-[22px] text-lila-900">¿Eliminar?</p>
            <p className="mt-2 text-[13px] leading-6 text-stone-600">
              Se va a eliminar a <strong>{inicial.nombre}</strong> del equipo. Esta acción no se puede deshacer.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setBorrando(false)}
                className="rounded-full border border-stone-200 px-5 py-2 text-[13px] font-semibold text-stone-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pendiente}
                onClick={onBorrar}
                className="rounded-full bg-red-600 px-5 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
              >
                {pendiente ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nombre</label>
          <input value={form.nombre} disabled={!editando} onChange={(e) => set("nombre", e.target.value)} placeholder="Lic. Ana Pérez" className={`${inputCls} ${dis}`} />
        </div>
        <div>
          <label className={labelCls}>Especialidad</label>
          <select
            value={form.especialidad_slug}
            disabled={!editando}
            onChange={(e) => {
              const esp = especialidades.find((x) => x.slug === e.target.value);
              setForm((p) => ({ ...p, especialidad_slug: e.target.value, especialidad: esp ? esp.nombre : p.especialidad }));
            }}
            className={`${inputCls} ${dis}`}
          >
            <option value="">Elegir...</option>
            {especialidades.map((e) => (
              <option key={e.slug} value={e.slug}>{e.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <span className={labelCls}>Modalidad</span>
          <div className="flex h-9 flex-wrap items-center gap-4">
            {[
              { id: "presencial", label: "Presencial", test: (v) => /presencial/i.test(v) },
              { id: "online", label: "Online", test: (v) => /online|virtual/i.test(v) },
            ].map((m) => (
              <label key={m.id} className="flex items-center gap-2 text-[13px] font-medium text-[#1F1F1F]">
                <input
                  type="checkbox"
                  disabled={!editando}
                  checked={m.test(form.modalidad)}
                  onChange={(e) => {
                    const tienePres = /presencial/i.test(form.modalidad);
                    const tieneOn = /online|virtual/i.test(form.modalidad);
                    const nuevoPres = m.id === "presencial" ? e.target.checked : tienePres;
                    const nuevoOn = m.id === "online" ? e.target.checked : tieneOn;
                    set(
                      "modalidad",
                      nuevoPres && nuevoOn
                        ? "Atención presencial y online"
                        : nuevoPres
                          ? "Atención presencial"
                          : nuevoOn
                            ? "Atención online"
                            : ""
                    );
                  }}
                  className="h-4 w-4 accent-lila-900"
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Matrícula</label>
          <input value={form.matricula} disabled={!editando} onChange={(e) => set("matricula", e.target.value)} placeholder="MP 0000" className={`${inputCls} ${dis}`} />
        </div>
        <div>
          <label className={labelCls}>WhatsApp (con país)</label>
          <input value={form.whatsapp} disabled={!editando} onChange={(e) => set("whatsapp", e.target.value.replace(/[^+0-9]/g, ""))} placeholder="5492984123456" className={`${inputCls} ${dis}`} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Descripción</label>
          <textarea value={form.descripcion} disabled={!editando} onChange={(e) => set("descripcion", e.target.value)} rows={2} className={areaCls} />
        </div>
        <div className="sm:col-span-2">
          <span className={labelCls}>Días de atención</span>
          <div className="flex flex-wrap gap-1.5">
            {DIAS.map((d) => (
              <button
                key={d}
                type="button"
                disabled={!editando}
                onClick={() => set("dias", form.dias.includes(d) ? form.dias.filter((x) => x !== d) : [...form.dias, d])}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold disabled:opacity-70 ${form.dias.includes(d) ? "bg-lila-900 text-white" : "bg-[#F2F3F9] text-[#1F1F1F]"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Horarios</label>
          <input value={form.horarios} disabled={!editando} onChange={(e) => set("horarios", e.target.value)} placeholder="14:00 a 19:00" className={`${inputCls} ${dis}`} />
        </div>
        <div className="sm:col-span-2">
          <span className={labelCls}>Formación profesional</span>
          <div className="grid gap-1.5">
            {areas.map((a, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  value={a}
                  disabled={!editando}
                  onChange={(e) => setAreas((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder="Ej: Diplomada en..."
                  className={`${inputCls} ${dis}`}
                />
                {editando && (
                  <button
                    type="button"
                    onClick={() => setAreas((prev) => prev.filter((_, j) => j !== i))}
                    aria-label="Quitar formación"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-red-200 text-[14px] font-bold text-red-600 hover:bg-red-50"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          {editando && (
            <button
              type="button"
              onClick={() => setAreas((prev) => [...prev, ""])}
              className="mt-2 rounded-full bg-emerald-600 px-4 py-1.5 text-[11px] font-semibold text-white hover:brightness-110"
            >
              + Agregar formación
            </button>
          )}
        </div>
        <div className="sm:col-span-2">
          <FotoField value={form.foto_url} onChange={(v) => set("foto_url", v)} etiqueta="Foto de perfil" deshabilitado={!editando} />
        </div>
      </div>

      {msg && <p className="mt-3 text-[13px] font-semibold text-stone-600">{msg}</p>}

      {editando && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={pendiente}
            onClick={onGuardar}
            className="rounded-full bg-emerald-600 px-5 py-2 text-[13px] font-semibold text-white hover:brightness-110 disabled:opacity-40"
          >
            {pendiente && !borrando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function EquipoAdmin({ profesionales, especialidades }) {
  const [abierta, setAbierta] = useState(null);
  const [creando, setCreando] = useState(false);
  const total = (profesionales || []).length;

  return (
    <div>
      <button
        type="button"
        onClick={() => { setCreando((v) => !v); setAbierta(null); }}
        className={`mb-3 rounded-full px-5 py-2 text-[13px] font-semibold text-white hover:brightness-110 ${creando ? "bg-red-600" : "bg-emerald-600"}`}
      >
        {creando ? "Cancelar" : "+ Agregar nuevo"}
      </button>

      {creando && (
        <div className="mb-3 overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
          <div className="bg-lila-50/60 px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lila-700">Nuevo profesional</p>
          </div>
          <EditorProfesional inicial={null} especialidades={especialidades} count={total} onCerrar={() => setCreando(false)} onGuardado={() => setCreando(false)} />
        </div>
      )}

      <div className="overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
        {(profesionales || []).map((p) => {
          const isAbierta = abierta === p.id;
          return (
            <div key={p.id} className={`border-b border-[#EEF2F7] transition-colors last:border-0 ${isAbierta ? "bg-lila-50" : ""}`}>
              <button
                type="button"
                onClick={() => setAbierta((a) => (a === p.id ? null : p.id))}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isAbierta ? "bg-lila-100/70" : "hover:bg-lila-50/50"}`}
              >
                {p.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.foto_url} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" />
                ) : (
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F2F3F9] text-[11px] text-[#6B7280]">
                    Sin foto
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#1F1F1F]">{p.nombre}</p>
                </div>
                <ChevronDown size={18} className={`shrink-0 text-lila-700 transition-transform ${isAbierta ? "rotate-180" : ""}`} />
              </button>
              {isAbierta && <EditorProfesional inicial={p} especialidades={especialidades} count={total} />}
            </div>
          );
        })}
        {total === 0 && !creando && (
          <p className="p-6 text-center text-[13px] text-[#6B7280]">Sin profesionales.</p>
        )}
      </div>
    </div>
  );
}
