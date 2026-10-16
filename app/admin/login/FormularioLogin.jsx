"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { loginAdmin } from "../actions";

export default function FormularioLogin() {
  const params = useSearchParams();
  const porInactividad = params.get("motivo") === "inactividad";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnoRef = useRef(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (cargando) return;
    if (siteKey && !turnstileToken) {
      setError("Esperá la verificación anti-bot.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      // El bloqueo por intentos y el captcha se verifican en el servidor.
      await loginAdmin(email.trim(), password, turnstileToken);
      // Recarga completa: garantiza sesión y navbar frescos.
      window.location.href = "/admin";
    } catch (err) {
      // Cada token de Turnstile sirve una sola vez: hay que reiniciarlo.
      turnoRef.current?.reset?.();
      setTurnstileToken("");
      setError(err?.message || "Email o contraseña incorrectos.");
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-[380px] rounded-[20px] border border-[#D5E0EE] bg-white p-6 shadow-[0_12px_32px_-8px_rgba(30,40,80,0.28)] sm:p-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logoSinFondo.png" alt="CRYBE" className="mx-auto h-12 w-auto" />
      <h1 className="mt-4 text-center font-titulo text-[22px] font-semibold text-[#1F1F1F]">
        Panel CRYBE
      </h1>
      <p className="mt-1 text-center text-[13px] text-[#6B7280]">
        Acceso solo para administración
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-lila-500">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@crybe.com.ar"
            className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-[14px] text-[#1F1F1F] outline-none focus:bg-lila-100"
          />
        </div>
        <div>
          <label htmlFor="admin-pass" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-lila-500">
            Contraseña
          </label>
          <input
            id="admin-pass"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-[14px] text-[#1F1F1F] outline-none focus:bg-lila-100"
          />
        </div>
        {siteKey ? (
          <Turnstile
            ref={turnoRef}
            siteKey={siteKey}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken("")}
            options={{ theme: "light", size: "flexible" }}
          />
        ) : null}
        {porInactividad && (
          <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-[13px] text-amber-800">
            Sesión cerrada por inactividad. Ingresá de nuevo.
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</p>
        )}
        <button
          type="submit"
          disabled={cargando}
          className="mt-1 inline-flex min-h-[42px] items-center justify-center rounded-full bg-lila-900 px-5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}