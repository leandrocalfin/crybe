"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import {
  guardarSeccionNosotros,
  guardarNosotrosItem,
  eliminarNosotrosItem,
} from "./actions";
import { ICONOS_NOMBRES, ICONOS_ETIQUETAS, Icono } from "../../lib/iconos";

const inputCls = "h-9 w-full rounded-xl border border-stone-200 bg-white px-3 text-[13px] text-[#1F1F1F] outline-none focus:bg-lila-100";
const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-lila-500";
const MAX_ITEMS = 8;

function EditorItem({ item, count, onCerrar }) {
  const esNuevo = !item?.id;
  const [icono, setIcono] = useState(item?.icono || "Sparkles");
  const [titulo, setTitulo] = useState(item?.titulo || "");
  const [texto, setTexto] = useState(item?.texto || "");
  const [editando, setEditando] = useState(esNuevo);
  const [borrando, setBorrando] = useState(false);
  const [msg, setMsg] = useState("");
  const [pendiente, start] = useTransition();

  const cambiado =
    icono !== (item?.icono || "Sparkles") ||
    titulo !== (item?.titulo || "") ||
    texto !== (item?.texto || "");

  const onGuardar = () => {
    setMsg("");
    start(async () => {
      try {
        await guardarNosotrosItem({
          ...(esNuevo ? {} : { id: item.id }),
          icono,
          titulo: titulo.trim(),
          texto: texto.trim(),
          orden: item?.orden ?? count,
          activo: true,
        });
        onCerrar(true);
      } catch (err) {
        setMsg(err?.message || "No se pudo guardar.");
      }
    });
  };

  return (
    <div className="border-t border-stone-200/70 px-4 py-4">
      {!esNuevo && (
        <div className="mb-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              if (editando) {
                setIcono(item?.icono || "Sparkles");
                setTitulo(item?.titulo || "");
                setTexto(item?.texto || "");
                setMsg("");
                setBorrando(false);
                setEditando(false);
              } else {
                setEditando(true);
              }
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition ${editando ? "bg-red-600 text-white hover:brightness-110" : "bg-lila-100 text-lila-900 hover:bg-lila-200"}`}
          >
            ✎ {editando ? "Cancelar" : "Editar"}
          </button>
          {borrando ? (
            <>
              <button
                type="button"
                disabled={pendiente}
                onClick={() => start(async () => {
                  try {
                    await eliminarNosotrosItem(item.id);
                  } catch {
                    setBorrando(false);
                  }
                })}
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
      <div className="grid gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label className={labelCls}>Título</label>
            <input value={titulo} disabled={!editando} onChange={(e) => setTitulo(e.target.value)} placeholder="Acompañamiento" className={`${inputCls} disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500`} />
          </div>
          <div className="shrink-0 sm:w-52">
            <label className={labelCls}>Icono</label>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#DCEFFB] to-[#9FD6F3] text-lila-900">
                <Icono nombre={icono} size={16} />
              </span>
              <select value={icono} disabled={!editando} onChange={(e) => setIcono(e.target.value)} className={`${inputCls} disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500`}>
                {ICONOS_NOMBRES.map((n) => (
                  <option key={n} value={n}>{ICONOS_ETIQUETAS[n] || n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className={labelCls}>Texto</label>
          <textarea value={texto} disabled={!editando} onChange={(e) => setTexto(e.target.value)} rows={3} className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-[13px] outline-none focus:bg-lila-100 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500" />
        </div>
      </div>
      {msg && <p className="mt-3 text-[12px] font-semibold text-stone-600">{msg}</p>}
      {editando && (
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={pendiente || (!esNuevo && !cambiado)}
          onClick={onGuardar}
          className="rounded-full bg-emerald-600 px-5 py-2 text-[12px] font-semibold text-white hover:brightness-110 disabled:opacity-40"
        >
          {pendiente ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
      )}
    </div>
  );
}

export default function NosotrosAdmin({ seccion, items }) {
  const [titulo, setTitulo] = useState(seccion?.titulo || "");
  const [descripcion, setDescripcion] = useState(seccion?.descripcion || "");
  const [editandoCab, setEditandoCab] = useState(false);
  const [msgCab, setMsgCab] = useState("");
  const [abierto, setAbierto] = useState(null);
  const [creando, setCreando] = useState(false);
  const [pendiente, start] = useTransition();

  const total = (items || []).length;
  const puedeAgregar = total < MAX_ITEMS;
  const cabCambiada = titulo !== (seccion?.titulo || "") || descripcion !== (seccion?.descripcion || "");

  const onGuardarCabecera = () => {
    setMsgCab("");
    start(async () => {
      try {
        await guardarSeccionNosotros({ titulo: titulo.trim(), descripcion: descripcion.trim() });
        setMsgCab("Guardado ✓");
      } catch (err) {
        setMsgCab(err?.message || "No se pudo guardar.");
      }
    });
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="mb-3 rounded-[16px] border border-[#D5E0EE] bg-white px-4 py-4">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (editandoCab) {
                setTitulo(seccion?.titulo || "");
                setDescripcion(seccion?.descripcion || "");
                setMsgCab("");
              }
              setEditandoCab((v) => !v);
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition ${editandoCab ? "bg-red-600 text-white hover:brightness-110" : "bg-lila-100 text-lila-900 hover:bg-lila-200"}`}
          >
            ✎ {editandoCab ? "Cancelar" : "Editar"}
          </button>
        </div>
        <div className="grid gap-3">
          <div>
            <label className={labelCls}>Título</label>
            <input value={titulo} disabled={!editandoCab} onChange={(e) => setTitulo(e.target.value)} className={`${inputCls} disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500`} />
          </div>
          <div>
            <label className={labelCls}>Descripción (línea vacía = párrafo nuevo)</label>
            <textarea value={descripcion} disabled={!editandoCab} onChange={(e) => setDescripcion(e.target.value)} rows={2} className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-[13px] outline-none focus:bg-lila-100 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500" />
          </div>
        </div>
        {msgCab && <p className="mt-2 text-[12px] font-semibold text-stone-600">{msgCab}</p>}
        {editandoCab && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            disabled={pendiente || !cabCambiada}
            onClick={onGuardarCabecera}
            className="rounded-full bg-emerald-600 px-5 py-2 text-[12px] font-semibold text-white hover:brightness-110 disabled:opacity-40"
          >
            {pendiente ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
        )}
      </div>

      {/* Ítems */}
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lila-700">
          Ítems ({total}/{MAX_ITEMS})
        </p>
        <button
          type="button"
          disabled={!puedeAgregar}
          onClick={() => { setCreando((v) => !v); setAbierto(null); }}
          className={`rounded-full px-5 py-2 text-[13px] font-semibold text-white hover:brightness-110 disabled:opacity-40 ${creando ? "bg-red-600" : "bg-emerald-600"}`}
        >
          {creando ? "Cancelar" : "+ Agregar ítem"}
        </button>
      </div>

      {creando && (
        <div className="mb-3 overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
          <div className="bg-lila-50/60 px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lila-700">Nuevo ítem</p>
          </div>
          <EditorItem count={total} onCerrar={() => setCreando(false)} />
        </div>
      )}

      <div className="overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
        {(items || []).map((it) => {
          const isAbierto = abierto === it.id;
          return (
            <div key={it.id} className={`border-b border-[#EEF2F7] transition-colors last:border-0 ${isAbierto ? "bg-lila-50" : ""}`}>
              <button
                type="button"
                onClick={() => setAbierto((a) => (a === it.id ? null : it.id))}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isAbierto ? "bg-lila-100/70" : "hover:bg-lila-50/50"}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#DCEFFB] to-[#9FD6F3] text-lila-900">
                  <Icono nombre={it.icono} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#1F1F1F]">{it.titulo}</p>
                </div>
                <ChevronDown size={18} className={`shrink-0 text-lila-700 transition-transform ${isAbierto ? "rotate-180" : ""}`} />
              </button>
              {isAbierto && <EditorItem item={it} count={total} onCerrar={() => setAbierto(null)} />}
            </div>
          );
        })}
        {total === 0 && (
          <p className="p-6 text-center text-[13px] text-[#6B7280]">Sin ítems.</p>
        )}
      </div>
    </div>
  );
}
