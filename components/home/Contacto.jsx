"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  CheckCircle2,
  Mail,
  MapPin,
  Clock,
  Phone,
  Send,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";
import { enviarContacto } from "../../app/actions";

const WHATSAPP_DEF = "5492984254590";
const INSTAGRAM_DEF = "https://www.instagram.com/centrocrybe/";
const EMAIL_DEF = "info@crybe.com.ar";

const inputClass =
  "w-full h-9 rounded-xl border-0 bg-[#F2F3F9] px-3.5 text-[13px] text-[#1F1F1F] placeholder:text-[11.5px] placeholder:text-[#6B7280]/60 outline-none transition focus:bg-[#EAF4FB] min-h-[36px]";

const Contacto = ({ ajustes }) => {
  // Datos centrales editables desde /admin → Datos y redes (con fallback local).
  const WHATSAPP_NUMBER = ajustes?.whatsapp || WHATSAPP_DEF;
  const INSTAGRAM_URL = ajustes?.instagram || INSTAGRAM_DEF;
  const FACEBOOK_URL = ajustes?.facebook || "";
  const EMAIL = ajustes?.email || EMAIL_DEF;
  const DIRECCION = ajustes?.direccion || "Tucumán 445, General Roca · Río Negro";
  const TELEFONO = ajustes?.telefono || "298 425-4590";
  const HORARIO_LV = ajustes?.horario_lv || "Lunes a Viernes: 08:00 a 20:00 hs";
  const HORARIO_SAB = ajustes?.horario_sab || "Sábados: 09:00 a 13:00 hs";
  const MAPA_Q = ajustes?.mapa || "Tucuman 445, General Roca, Rio Negro";
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    motivo: "Consulta clínica general / Especialidades",
    mensaje: "",
    empresa: "", // honeypot: debe quedar vacío
  });
  const [estado, setEstado] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnoRef = useRef(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola Centro CRYBE, soy ${form.nombre || ""}. Motivo: ${form.motivo}. ${form.mensaje} (Tel: ${form.telefono}${form.email ? ` - ${form.email}` : ""})`
  )}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    setErrorMsg("");
    // Validación cliente espejo del servidor (el servidor re-valida todo con Zod)
    if (form.nombre.trim().length < 2 || form.nombre.trim().length > 80) {
      setEstado("error");
      setErrorMsg("Revisá tu nombre (2 a 80 letras).");
      return;
    }
    if (!/^[+0-9() \-]{6,25}$/.test(form.telefono.trim())) {
      setEstado("error");
      setErrorMsg("Revisá tu teléfono (solo números, +, espacios y guiones).");
      return;
    }
    if (form.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email.trim())) {
      setEstado("error");
      setErrorMsg("Revisá tu email.");
      return;
    }
    if (form.mensaje.trim().length < 10 || form.mensaje.trim().length > 1000) {
      setEstado("error");
      setErrorMsg("El mensaje debe tener entre 10 y 1000 caracteres.");
      return;
    }
    try {
      await enviarContacto({ ...form, turnstileToken });
      setEstado("ok");
    } catch (err) {
      setEstado("error");
      setErrorMsg(err?.message || "Hubo un problema al enviar. Probá de nuevo o escribinos por WhatsApp.");
      turnoRef.current?.reset?.();
      setTurnstileToken("");
    }
  };

  const onOtroMensaje = () => {
    setEstado("idle");
    setErrorMsg("");
    setTurnstileToken("");
    setForm({
      nombre: "",
      telefono: "",
      email: "",
      motivo: "Consulta clínica general / Especialidades",
      mensaje: "",
      empresa: "",
    });
  };

  return (
    <section
      id="contacto"
      data-navbar-color="#f2f3ff"
      className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-12 md:px-12 md:py-14 lg:px-16"
      style={{ background: "#f2f3ff" }}
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* ENCABEZADO CENTRADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-6 max-w-[720px] text-center sm:mb-8"
        >
          <p className="font-titulo text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0F3A7A] sm:text-[15px]">
            Estamos para Ayudarte
          </p>
          <h2 className="mt-2 font-titulo text-[26px] font-semibold leading-tight text-[#1F1F1F] sm:text-[30px] md:text-[38px]">
            Contactate con Nosotros
          </h2>
          <p className="mx-auto mt-4 text-[15px] leading-7 text-[#3D3D3D] sm:text-[16px]">
            Envianos tu consulta sobre especialidades, turnos o alquiler de
            módulos. Te respondemos a la brevedad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* FORMULARIO */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="rounded-[20px] border border-[#D5E0EE] bg-white p-3 sm:p-5 md:p-5 lg:p-6 shadow-[0_12px_32px_-8px_rgba(30,40,80,0.28)] lg:col-span-7"
          >
            {estado === "ok" ? (
              <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-5 text-[14px] leading-7 text-green-900">
                <CheckCircle2 size={20} className="mt-1 shrink-0" />
                <div>
                  <p className="font-semibold">
                    ¡Gracias {form.nombre || ""}! Recibimos tu mensaje.
                  </p>
                  <p className="mt-1 text-green-800">
                    Confirmalo por WhatsApp para una respuesta más rápida.
                  </p>
<div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-[#0F3A7A] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110 min-h-[40px]"
                      >
                        <MessageCircle size={16} />
                        Confirmar por WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={onOtroMensaje}
                        className="inline-flex items-center justify-center w-full sm:w-auto rounded-full border border-green-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-green-900 transition hover:border-green-300 min-h-[40px]"
                      >
                        Enviar otro mensaje
                      </button>
                    </div>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex h-full flex-col space-y-2.5" noValidate={false}>
                {/* Honeypot anti-bot: invisible para humanos */}
                <input
                  type="text"
                  name="empresa"
                  value={form.empresa}
                  onChange={onChange}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contacto-nombre" className="mb-1 block text-[12px] font-semibold text-[#1F1F1F] sm:text-[13px]">
                      Nombre y Apellido
                    </label>
                    <input
                      id="contacto-nombre"
                      name="nombre"
                      required
                      minLength={2}
                      maxLength={80}
                      pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü'’\-. ]+"
                      value={form.nombre}
                      onChange={onChange}
                      placeholder="Ej: Marcela Benítez"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contacto-telefono" className="mb-1 block text-[12px] font-semibold text-[#1F1F1F] sm:text-[13px]">
                      Teléfono / Celular
                    </label>
                    <input
                      id="contacto-telefono"
                      name="telefono"
                      required
                      minLength={6}
                      maxLength={25}
                      pattern="[+0-9() \-]+"
                      value={form.telefono}
                      onChange={onChange}
                      placeholder="Ej: 2984 00-0000"
                      autoComplete="tel"
                      inputMode="tel"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contacto-email" className="mb-1 block text-[12px] font-semibold text-[#1F1F1F] sm:text-[13px]">
                    Correo Electrónico
                  </label>
                  <input
                    id="contacto-email"
                    name="email"
                    type="email"
                    maxLength={160}
                    value={form.email}
                    onChange={onChange}
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contacto-motivo" className="mb-1 block text-[12px] font-semibold text-[#1F1F1F] sm:text-[13px]">
                    Motivo de tu Consulta
                  </label>
                  <select
                    id="contacto-motivo"
                    name="motivo"
                    value={form.motivo}
                    onChange={onChange}
                    className={`${inputClass} appearance-none bg-no-repeat bg-right text-ellipsis`}
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1.25rem",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option>Consulta clínica general / Especialidades</option>
                    <option>Alquiler de consultorios / Módulos</option>
                    <option>Quiero formar parte del equipo</option>
                    <option>Turnos y horarios</option>
                  </select>
                </div>

                <div className="flex flex-1 flex-col">
                  <label htmlFor="contacto-mensaje" className="mb-1 block text-[12px] font-semibold text-[#1F1F1F] sm:text-[13px]">
                    Mensaje
                  </label>
                  <textarea
                    id="contacto-mensaje"
                    name="mensaje"
                    required
                    minLength={10}
                    maxLength={1000}
                    value={form.mensaje}
                    onChange={onChange}
                    rows={3}
                    placeholder="Contanos brevemente el motivo (sin datos clínicos detallados)..."
                    className="w-full flex-1 rounded-xl border-0 bg-[#F2F3F9] p-2.5 text-[13px] text-[#1F1F1F] placeholder:text-[11.5px] placeholder:text-[#6B7280]/60 outline-none transition focus:bg-[#EAF4FB] min-h-[72px]"
                  />
                </div>

                <p className="flex items-start gap-1.5 rounded-xl bg-[#FFF8E8] px-3 py-2 text-[11.5px] leading-5 text-[#8A6D1B]">
                  <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                  Por tu privacidad, evitá enviar información clínica detallada
                  (diagnósticos, estudios o medicación). Alcanzan tus datos de
                  contacto y el motivo general.
                </p>

                {siteKey ? (
                  <Turnstile
                    ref={turnoRef}
                    siteKey={siteKey}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                    options={{ theme: "light", size: "flexible" }}
                  />
                ) : null}

                {estado === "error" && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {errorMsg || "Hubo un problema al enviar. Probá de nuevo o escribinos por WhatsApp."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#0F3A7A] px-5 py-1.5 text-[12px] font-semibold text-white shadow-[0_8px_22px_rgba(15,58,122,0.3)] transition-all hover:-translate-y-[2px] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 min-h-8"
                >
                  <Send size={14} />
                  {estado === "enviando" ? "Enviando..." : "Enviar Consulta"}
                </button>
              </form>
            )}
          </motion.div>

          {/* INFO DE SEDE */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-3 lg:grid-cols-1 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="h-full rounded-[20px] border border-[#D5E0EE] bg-white p-3 sm:p-5 shadow-[0_12px_32px_-8px_rgba(30,40,80,0.28)]"
            >
              <h3 className="font-titulo text-[16px] font-semibold text-[#1F1F1F] sm:text-[19px]">
                Información de la Sede
              </h3>

              <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF4FB] text-[#0F3A7A] sm:h-10 sm:w-10">
                    <MapPin size={15} />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-[#1F1F1F] sm:text-[13px]">Dirección</p>
                    <p className="mt-0.5 text-[12.5px] leading-5 text-[#4B5563] sm:text-[13.5px] sm:leading-6">
                      {DIRECCION}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ACEDFF]/40 text-[#0F3A7A] sm:h-10 sm:w-10">
                    <Clock size={15} />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-[#1F1F1F] sm:text-[13px]">Horarios de Atención</p>
                    <p className="mt-0.5 text-[12.5px] leading-5 text-[#4B5563] sm:text-[13.5px] sm:leading-6">
                      {HORARIO_LV}<br />
                      {HORARIO_SAB}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E9EEF8] text-[#0F3A7A] sm:h-10 sm:w-10">
                    <Phone size={15} />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-[#1F1F1F] sm:text-[13px]">Recepción Telefónica</p>
                    <p className="mt-0.5 text-[12.5px] leading-5 text-[#4B5563] sm:text-[13.5px] sm:leading-6">
                      {TELEFONO}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2.5 sm:mt-5 sm:gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram: @centrocrybe"
                  aria-label="Instagram Centro CRYBE"
                  className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:brightness-110"
                  style={{
                    background:
                      "linear-gradient(45deg, #F09433 0%, #E6683C 25%, #DC2743 50%, #CC2366 75%, #BC1888 100%)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>

                {FACEBOOK_URL ? (
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook Centro CRYBE"
                    aria-label="Facebook Centro CRYBE"
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:brightness-110"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.5v3H11v7h2.5z" />
                    </svg>
                  </a>
                ) : null}

                <a
                  href={`mailto:${EMAIL}`}
                  title={EMAIL}
                  aria-label="Email Centro CRYBE"
                  className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#0F3A7A] text-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:brightness-110"
                >
                  <Mail size={16} />
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola CRYBE, quisiera hacer una consulta.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Escribinos por WhatsApp"
                  aria-label="WhatsApp Centro CRYBE"
                  className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:brightness-95"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.03h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* MAPA */}
            <div className="relative h-40 sm:h-48 md:h-full md:min-h-[240px] lg:h-48 lg:min-h-0 overflow-hidden rounded-[20px] border border-[#D5E0EE] shadow-[0_12px_32px_-8px_rgba(30,40,80,0.28)]">
              <iframe
                title="Ubicación Centro CRYBE"
                src={`https://www.google.com/maps?q=${encodeURIComponent(MAPA_Q)}&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-semibold text-[#0F3A7A] shadow backdrop-blur sm:text-[12px]">
                <MapPin size={13} />
                Sede Central CRYBE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;

