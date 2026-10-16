import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
// React dev usa eval() para debugging (en producción nunca). Se permite
// 'unsafe-eval' solo en desarrollo para no ensuciar la consola local.
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  "https://challenges.cloudflare.com",
  ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
].join(" ");
const csp = [
  "default-src 'self'",
  // Next.js hidratación + widget anti-bot Cloudflare Turnstile
  `script-src ${scriptSrc}`,
  // Tailwind/atributos style inline + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // Imágenes locales, data: URIs, Storage de Supabase y mapa de Google
  "img-src 'self' data: blob: https://*.supabase.co https://*.googleapis.com https://*.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
  // Turnstile + iframe del mapa en Contacto
  "frame-src https://challenges.cloudflare.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // localhost lo ignora; en producción (HTTPS) activa HSTS.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig = {
  experimental: {
    // Achica el JS que baja al celu/tablet: importa solo el icono/componente
    // usado en vez del paquete entero.
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      // Límite de Server Actions: 1MB por defecto. Las fotos llegan hasta
      // 4MB (+~20KB de multipart), así que apenas por encima.
      bodySizeLimit: "5mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
