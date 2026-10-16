"use client";

import { useRef, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { guardarNovedad, eliminarNovedad, subirFoto } from "./actions";
import FotoField from "./foto-field";
import { comprimirImagen } from "../../lib/comprimir";

const CATEGORIAS = [
  "Psicología",
  "Psiquiatría",
  "Fonoaudiología",
  "Psicopedagogía",
  "Kinesiología y Psicomotricidad",
  "Equipo CRYBE",
];

const inputCls = "h-9 w-full rounded-xl border border-stone-200 bg-white px-3 text-[14px] text-[#1F1F1F] outline-none focus:bg-lila-100";
const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-lila-500";
const areaCls = "w-full rounded-xl border border-stone-200 bg-white p-2.5 text-[14px] outline-none focus:bg-lila-100 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500";
const dis = "disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500";

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

// Galería: hasta 5 imágenes extra (opcional, con 1 alcanza).
function GaleriaField({ value, onChange, deshabilitado }) {
  const inputRef = useRef(null);
  const [slot, setSlot] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const lista = value || [];

  const onArchivo = async (e) => {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    setSubiendo(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", await comprimirImagen(file));
      const { url } = await subirFoto(fd);
      const copia = [...lista];
      copia[slot] = url;
      onChange(copia.filter(Boolean).slice(0, 5));
    } catch (err) {
      setError(err?.message || "No se pudo subir.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="relative h-14 w-14 shrink-0">
            {lista[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lista[i]} alt={`Extra ${i + 1}`} className="h-14 w-14 rounded-lg object-cover" />
            ) : (
              <button
                type="button"
                disabled={deshabilitado || subiendo}
                onClick={() => { setSlot(i); inputRef.current?.click(); }}
                className="grid h-14 w-14 place-items-center rounded-lg border border-dashed border-stone-300 bg-[#F8F7FC] text-[17px] text-stone-400 hover:border-lila-500 hover:text-lila-700 disabled:opacity-50"
              >
                +
              </button>
            )}
            {lista[i] && !deshabilitado && (
              <button
                type="button"
                onClick={() => onChange(lista.filter((_, j) => j !== i))}
                aria-label="Quitar imagen"
                className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[13px] font-bold text-red-600 shadow"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onArchivo} className="hidden" />
      {subiendo && <p className="mt-1 text-[11px] text-stone-500">Subiendo...</p>}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

export function EditorNovedad({ inicial, profesionales, onCerrar, onGuardado }) {
  const esNuevo = !inicial?.id;
  const [form, setForm] = useState(() => ({
    categoria: inicial?.categoria || "Psicología",
    titulo: inicial?.titulo || "",
    descripcion: inicial?.descripcion || "",
    imagen_principal: inicial?.imagen_principal || "",
    autor: inicial?.autor || "Equipo CRYBE",
    publicado: inicial?.publicado ?? true,
  }));
  const [cuerpoTxt, setCuerpoTxt] = useState((inicial?.cuerpo || []).join("\n\n"));
  const [galeria, setGaleria] = useState(inicial?.galeria || []);
  const [editando, setEditando] = useState(esNuevo);
  const [borrando, setBorrando] = useState(false);
  const [msg, setMsg] = useState("");
  const [pendiente, start] = useTransition();

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const revertir = () => {
    setForm({
      categoria: inicial?.categoria || "Psicología",
      titulo: inicial?.titulo || "",
      descripcion: inicial?.descripcion || "",
      imagen_principal: inicial?.imagen_principal || "",
      autor: inicial?.autor || "Equipo CRYBE",
      fecha_publicacion: inicial?.fecha_publicacion || new Date().toISOString().slice(0, 10),
      publicado: inicial?.publicado ?? true,
    });
    setCuerpoTxt((inicial?.cuerpo || []).join("\n\n"));
    setGaleria(inicial?.galeria || []);
    setMsg("");
    setBorrando(false);
    setEditando(false);
  };

  const onGuardar = () => {
    setMsg("");
    if (form.titulo.trim().length < 4) {
      setMsg("El título es obligatorio.");
      return;
    }
    const cuerpo = cuerpoTxt.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    start(async () => {
      try {
        await guardarNovedad({
          ...(esNuevo
            ? { slug: slugify(form.titulo), fecha_publicacion: new Date().toISOString().slice(0, 10) }
            : { id: inicial.id, slug: inicial.slug }),
          ...form,
          titulo: form.titulo.trim(),
          cuerpo,
          galeria,
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
        await eliminarNovedad(inicial.id);
        onCerrar?.();
      } catch (err) {
        setMsg(err?.message || "No se pudo eliminar.");
        setBorrando(false);
      }
    });
  };

  const onTogglePublicado = () => {
    setMsg("");
    start(async () => {
      try {
        const cuerpo = cuerpoTxt.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        await guardarNovedad({
          id: inicial.id,
          slug: inicial.slug,
          ...form,
          cuerpo,
          galeria,
          publicado: !inicial.publicado,
        });
        setForm((p) => ({ ...p, publicado: !inicial.publicado }));
      } catch (err) {
        setMsg(err?.message || "No se pudo actualizar.");
      }
    });
  };

  const autorValido = (profesionales || []).some((p) => p.nombre === form.autor) || form.autor === "Equipo CRYBE";

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
          <button
            type="button"
            onClick={() => setBorrando(true)}
            className="rounded-xl border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
          <button
            type="button"
            disabled={pendiente}
            onClick={onTogglePublicado}
            className={`rounded-xl px-3 py-2 text-[11px] font-semibold ${inicial.publicado ? "bg-green-100 text-green-900" : "bg-gray-200 text-gray-600"}`}
          >
            {inicial.publicado ? "Visible" : "Oculto"}
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Título</label>
          <input value={form.titulo} disabled={!editando} onChange={(e) => set("titulo", e.target.value)} className={`${inputCls} ${dis}`} />
        </div>
        <div>
          <label className={labelCls}>Categoría</label>
          <select value={form.categoria} disabled={!editando} onChange={(e) => set("categoria", e.target.value)} className={`${inputCls} ${dis}`}>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Autor</label>
          <select value={autorValido ? form.autor : "Equipo CRYBE"} disabled={!editando} onChange={(e) => set("autor", e.target.value)} className={`${inputCls} ${dis}`}>
            <option value="Equipo CRYBE">Equipo CRYBE</option>
            {(profesionales || []).map((p) => (
              <option key={p.id} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Descripción corta</label>
          <input value={form.descripcion} disabled={!editando} onChange={(e) => set("descripcion", e.target.value)} className={`${inputCls} ${dis}`} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Cuerpo (párrafos separados por línea vacía)</label>
          <textarea value={cuerpoTxt} disabled={!editando} onChange={(e) => setCuerpoTxt(e.target.value)} rows={4} className={areaCls} />
        </div>
        <div className="sm:col-span-2">
          <FotoField value={form.imagen_principal} onChange={(v) => set("imagen_principal", v)} etiqueta="Imagen de portada" deshabilitado={!editando} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Imágenes extra (hasta 5, opcional)</label>
          <GaleriaField value={galeria} onChange={setGaleria} deshabilitado={!editando} />
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

      {borrando && !esNuevo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0A1830]/60 p-4 backdrop-blur-sm" onClick={() => setBorrando(false)}>
          <div className="w-full max-w-[360px] rounded-[20px] bg-white p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif-display text-[22px] text-lila-900">¿Eliminar?</p>
            <p className="mt-2 text-[13px] leading-6 text-stone-600">
              Se va a eliminar el artículo <strong>{inicial.titulo}</strong>. Esta acción no se puede deshacer.
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
    </div>
  );
}

export default function NovedadesAdmin({ novedades, profesionales }) {
  const [abierta, setAbierta] = useState(null);
  const [creando, setCreando] = useState(false);
  const total = (novedades || []).length;

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
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lila-700">Nuevo artículo</p>
          </div>
          <EditorNovedad inicial={null} profesionales={profesionales} onCerrar={() => setCreando(false)} onGuardado={() => setCreando(false)} />
        </div>
      )}

      <div className="overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white">
        {(novedades || []).map((n) => {
          const isAbierta = abierta === n.id;
          return (
            <div key={n.id} className={`border-b border-[#EEF2F7] transition-colors last:border-0 ${isAbierta ? "bg-lila-50" : ""}`}>
              <button
                type="button"
                onClick={() => setAbierta((a) => (a === n.id ? null : n.id))}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isAbierta ? "bg-lila-100/70" : "hover:bg-lila-50/50"}`}
              >
                {n.imagen_principal ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.imagen_principal} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F2F3F9] text-[11px] text-[#6B7280]">
                    Sin foto
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#1F1F1F]">{n.titulo}</p>
                </div>
                {!n.publicado && (
                  <span className="shrink-0 rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">Borrador</span>
                )}
                <ChevronDown size={18} className={`shrink-0 text-lila-700 transition-transform ${isAbierta ? "rotate-180" : ""}`} />
              </button>
              {isAbierta && <EditorNovedad inicial={n} profesionales={profesionales} />}
            </div>
          );
        })}
        {total === 0 && !creando && (
          <p className="p-6 text-center text-[13px] text-[#6B7280]">Sin artículos.</p>
        )}
      </div>
    </div>
  );
}
