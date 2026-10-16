"use client";

import { useState, useTransition } from "react";
import { Check, Pencil, X } from "lucide-react";
import { guardarAjustes, cambiarPassword } from "./actions";
import FotoField from "./foto-field";

const inputCls = "h-9 w-full rounded-xl border border-stone-200 bg-white px-3 text-[13px] text-[#1F1F1F] outline-none focus:bg-lila-100";
const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-lila-500";
const headerCls = "text-[11px] font-bold uppercase tracking-[0.18em] text-lila-700";

const CAMPOS = [
  { clave: "whatsapp", label: "WhatsApp (con código país)", placeholder: "5492984123456" },
  { clave: "telefono", label: "Teléfono visible", placeholder: "298 425-4590" },
  { clave: "email", label: "Email", placeholder: "info@crybe.com.ar" },
  { clave: "instagram", label: "Instagram (URL)", placeholder: "https://www.instagram.com/..." },
  { clave: "facebook", label: "Facebook (URL, opcional)", placeholder: "https://www.facebook.com/..." },
  { clave: "direccion", label: "Dirección", placeholder: "Tucumán 445, General Roca · Río Negro" },
  { clave: "direccion_corta", label: "Dirección corta (footer)", placeholder: "Tucuman 445, General Roca" },
  { clave: "mapa", label: "Mapa (búsqueda de Google Maps)", placeholder: "Tucuman 445, General Roca, Rio Negro" },
  { clave: "horario_lv", label: "Horario lunes a viernes", placeholder: "Lunes a Viernes: 08:00 a 20:00 hs" },
  { clave: "horario_sab", label: "Horario sábado", placeholder: "Sábados: 09:00 a 13:00 hs" },
];

export default function DatosAdmin({ ajustes }) {
  const [form, setForm] = useState(() => {
    const base = {};
    CAMPOS.forEach((c) => { base[c.clave] = ajustes?.[c.clave] || ""; });
    return base;
  });
  const [avatar, setAvatar] = useState(ajustes?.avatar || "");
  const [editando, setEditando] = useState(false);
  const [msg, setMsg] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [editPass, setEditPass] = useState(false);
  const [msgPass, setMsgPass] = useState("");
  const [pendiente, start] = useTransition();

  const cambiado = CAMPOS.some((c) => form[c.clave] !== (ajustes?.[c.clave] || "")) || avatar !== (ajustes?.avatar || "");

  const onGuardar = () => {
    setMsg("");
    start(async () => {
      try {
        await guardarAjustes({ ...form, avatar });
        setMsg("Guardado ✓");
      } catch (err) {
        setMsg(err?.message || "No se pudo guardar.");
      }
    });
  };

  const onPassword = () => {
    setMsgPass("");
    start(async () => {
      try {
        await cambiarPassword(pass1, pass2);
        setMsgPass("Contraseña actualizada ✓");
        setPass1("");
        setPass2("");
      } catch (err) {
        setMsgPass(err?.message || "No se pudo cambiar.");
      }
    });
  };

  const alternarEdicion = () => {
    if (editando) {
      const base = {};
      CAMPOS.forEach((c) => { base[c.clave] = ajustes?.[c.clave] || ""; });
      setForm(base);
      setAvatar(ajustes?.avatar || "");
      setMsg("");
      setEditando(false);
    } else {
      setMsg("");
      setEditando(true);
    }
  };

  return (
    <div className="space-y-3">
      {/* Foto de perfil */}
      <div className="overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
        <div className="flex items-center justify-between gap-3 bg-lila-50/60 px-4 py-2.5">
          <p className={headerCls}>Foto de perfil</p>
          {editando ? (
            <button
              type="button"
              onClick={alternarEdicion}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110"
            >
              <X size={13} /> Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={alternarEdicion}
              className="inline-flex items-center gap-1.5 rounded-lg bg-lila-100 px-3 py-1.5 text-[11px] font-semibold text-lila-900 transition hover:bg-lila-200"
            >
              <Pencil size={13} /> Editar
            </button>
          )}
        </div>
        <div className="px-4 py-4">
          <FotoField value={avatar} onChange={setAvatar} etiqueta="Se muestra en el botón del navbar" deshabilitado={!editando} />
        </div>
      </div>

      {/* Contacto y redes */}
      <div className="overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
        <div className="flex items-center justify-between gap-3 bg-lila-50/60 px-4 py-2.5">
          <p className={headerCls}>Contacto y redes</p>
          <div className="flex items-center gap-2">
            {msg && <span className="text-[12px] font-semibold text-emerald-700">{msg}</span>}
            {editando ? (
              <>
                <button
                  type="button"
                  onClick={alternarEdicion}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110"
                >
                  <X size={13} /> Cancelar
                </button>
                <button
                  type="button"
                  disabled={pendiente || !cambiado}
                  onClick={onGuardar}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
                >
                  <Check size={13} /> {pendiente ? "Guardando..." : "Guardar"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={alternarEdicion}
                className="inline-flex items-center gap-1.5 rounded-lg bg-lila-100 px-3 py-1.5 text-[11px] font-semibold text-lila-900 transition hover:bg-lila-200"
              >
                <Pencil size={13} /> Editar
              </button>
            )}
          </div>
        </div>
        <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
          {CAMPOS.map((c) => (
            <div key={c.clave} className={["direccion", "mapa"].includes(c.clave) ? "sm:col-span-2" : ""}>
              <label className={labelCls}>{c.label}</label>
              <input
                value={form[c.clave]}
                disabled={!editando}
                onChange={(e) => setForm((p) => ({ ...p, [c.clave]: e.target.value }))}
                placeholder={c.placeholder}
                className={`${inputCls} disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contraseña */}
      <div className="overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
        <div className="flex items-center justify-between gap-3 bg-lila-50/60 px-4 py-2.5">
          <p className={headerCls}>Contraseña</p>
          {editPass ? (
            <button
              type="button"
              onClick={() => { setEditPass(false); setMsgPass(""); setPass1(""); setPass2(""); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110"
            >
              <X size={13} /> Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setEditPass(true); setMsgPass(""); setPass1(""); setPass2(""); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-lila-100 px-3 py-1.5 text-[11px] font-semibold text-lila-900 transition hover:bg-lila-200"
            >
              <Pencil size={13} /> Cambiar
            </button>
          )}
        </div>
        {editPass && (
          <div className="px-4 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Nueva contraseña</label>
                <input type="password" value={pass1} onChange={(e) => setPass1(e.target.value)} autoComplete="new-password" placeholder="Mínimo 8 caracteres" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Repetir contraseña</label>
                <input type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} autoComplete="new-password" className={inputCls} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-3">
              {msgPass && <span className="text-[12px] font-semibold text-emerald-700">{msgPass}</span>}
              <button
                type="button"
                disabled={pendiente || !pass1 || pass1 !== pass2}
                onClick={onPassword}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
              >
                <Check size={13} /> {pendiente ? "Guardando..." : "Guardar contraseña"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
