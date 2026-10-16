"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { guardarPortada, eliminarPortada } from "./actions";
import FotoField from "./foto-field";

const inputCls = "h-9 w-full rounded-xl border border-stone-200 bg-white px-3 text-[13px] text-[#1F1F1F] outline-none focus:bg-lila-100";
const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-lila-500";
const areaCls = "w-full rounded-xl border border-stone-200 bg-white p-2.5 text-[13px] outline-none focus:bg-lila-100 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500";
const dis = "disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500";

export function EditorPortada({ portada, count, onCerrar, onGuardado }) {
  const esNueva = !portada?.id;
  const [nombre, setNombre] = useState(portada?.nombre || "");
  const [titulo, setTitulo] = useState(portada?.titulo || "");
  const [subtitulo, setSubtitulo] = useState(portada?.subtitulo || "");
  const [imagen, setImagen] = useState(portada?.imagen || "");
  const [editando, setEditando] = useState(esNueva);
  const [borrando, setBorrando] = useState(false);
  const [msg, setMsg] = useState("");
  const [pendiente, start] = useTransition();

  const cambiado =
    nombre !== (portada?.nombre || "") ||
    titulo !== (portada?.titulo || "") ||
    subtitulo !== (portada?.subtitulo || "") ||
    imagen !== (portada?.imagen || "");

  const revertir = () => {
    setNombre(portada?.nombre || "");
    setTitulo(portada?.titulo || "");
    setSubtitulo(portada?.subtitulo || "");
    setImagen(portada?.imagen || "");
    setMsg("");
    setBorrando(false);
    setEditando(false);
  };

  const onGuardar = () => {
    setMsg("");
    if (titulo.trim().length < 2) {
      setMsg("El título es obligatorio.");
      return;
    }
    start(async () => {
      try {
        await guardarPortada({
          ...(esNueva ? {} : { id: portada.id }),
          nombre: nombre.trim(),
          titulo: titulo.trim(),
          subtitulo: subtitulo.trim(),
          imagen,
          orden: portada?.orden ?? count ?? 0,
          activo: true,
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
        await eliminarPortada(portada.id);
        onCerrar?.();
      } catch (err) {
        setMsg(err?.message || "No se pudo eliminar.");
        setBorrando(false);
      }
    });
  };

  return (
    <div className="border-t border-stone-200/70 px-4 py-4">
      {!esNueva && (
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
            <button
              type="button"
              onClick={() => setBorrando(true)}
              className="rounded-xl border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50"
            >
              Eliminar
            </button>
          )}
        </div>
      )}

      {/* Vista previa mini del slide */}
      <div className="relative mb-3 overflow-hidden rounded-xl">
        {imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagen} alt={nombre || "Vista previa"} className="h-28 w-full object-cover" />
        ) : (
          <div className="flex h-28 w-full items-center justify-center bg-[#F2F3F9] text-[11px] text-[#6B7280]">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-lila-700">{nombre || "Nombre"}</p>
          <p className="mt-0.5 text-[13px] font-medium leading-snug text-[#1F1F1F]">
            {titulo.split("\n")[0] || "Título del hero"}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nombre (texto chico arriba)</label>
          <input
            value={nombre}
            disabled={!editando}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Psicología"
            className={`${inputCls} ${dis}`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Título (Enter = renglón nuevo en el hero)</label>
          <textarea value={titulo} disabled={!editando} onChange={(e) => setTitulo(e.target.value)} rows={2} className={areaCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Subtítulo</label>
          <textarea value={subtitulo} disabled={!editando} onChange={(e) => setSubtitulo(e.target.value)} rows={2} className={areaCls} />
        </div>
        <div className="sm:col-span-2">
          <FotoField value={imagen} onChange={setImagen} etiqueta="Imagen del slide" deshabilitado={!editando} />
        </div>
      </div>

      {msg && <p className="mt-3 text-[12px] font-semibold text-stone-600">{msg}</p>}

      {editando && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={pendiente || (!esNueva && !cambiado)}
            onClick={onGuardar}
            className="rounded-full bg-emerald-600 px-5 py-2 text-[12px] font-semibold text-white hover:brightness-110 disabled:opacity-40"
          >
            {pendiente && !borrando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function InicioAdmin({ portadas }) {
  const [abierta, setAbierta] = useState(null);
  const [creando, setCreando] = useState(false);
  const total = (portadas || []).length;

  return (
    <div>
      <button
        type="button"
        onClick={() => { setCreando((v) => !v); setAbierta(null); }}
        className={`mb-3 rounded-full px-5 py-2 text-[13px] font-semibold text-white hover:brightness-110 ${creando ? "bg-red-600" : "bg-emerald-600"}`}
      >
        {creando ? "Cancelar" : "+ Agregar nueva"}
      </button>

      {creando && (
        <div className="mb-3 overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
          <div className="bg-lila-50/60 px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lila-700">Nueva presentación</p>
          </div>
          <EditorPortada portada={null} count={total} onCerrar={() => setCreando(false)} onGuardado={() => setCreando(false)} />
        </div>
      )}

      <div className="overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
        {(portadas || []).map((p) => {
          const isAbierta = abierta === p.id;
          const thumb = p.imagen;
          return (
            <div key={p.id} className={`border-b border-[#EEF2F7] transition-colors last:border-0 ${isAbierta ? "bg-lila-50" : ""}`}>
              <button
                type="button"
                onClick={() => setAbierta((a) => (a === p.id ? null : p.id))}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isAbierta ? "bg-lila-100/70" : "hover:bg-lila-50/50"}`}
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F2F3F9] text-[9px] text-[#6B7280]">
                    Sin foto
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#1F1F1F]">{p.nombre || p.titulo.split("\n")[0]}</p>
                </div>
                <ChevronDown size={18} className={`shrink-0 text-lila-700 transition-transform ${isAbierta ? "rotate-180" : ""}`} />
              </button>
              {isAbierta && <EditorPortada portada={p} count={total} />}
            </div>
          );
        })}
        {total === 0 && !creando && (
          <p className="p-6 text-center text-[13px] text-[#6B7280]">Sin presentaciones.</p>
        )}
      </div>
    </div>
  );
}
