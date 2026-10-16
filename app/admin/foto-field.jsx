"use client";

import { useRef, useState } from "react";
import { subirFoto } from "./actions";
import { comprimirImagen } from "../../lib/comprimir";

// Campo de foto reutilizable: vista previa + subir archivo + pegar URL.
export default function FotoField({ value, onChange, etiqueta = "Foto", deshabilitado = false }) {
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  const onArchivo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", await comprimirImagen(file));
      const { url } = await subirFoto(fd);
      onChange(url);
    } catch (err) {
      setError(err?.message || "No se pudo subir.");
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-lila-500">{etiqueta}</span>
      <div className="flex flex-col items-start gap-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Vista previa" className="h-16 w-16 rounded-xl object-cover object-top" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F2F3F9] text-[10px] text-[#6B7280]">
            Sin foto
          </div>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={subiendo || deshabilitado}
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-lila-900/25 px-4 py-1.5 text-[11px] font-semibold text-lila-900 hover:bg-lila-100 disabled:opacity-60"
          >
            {subiendo ? "Subiendo..." : value ? "Cambiar imagen" : "Adjuntar imagen"}
          </button>
          {value && !deshabilitado && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-full border border-red-200 px-4 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50"
            >
              Quitar
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onArchivo} className="hidden" />
        {error && <p className="text-[11px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}
