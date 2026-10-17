import "./globals.css";
import { League_Spartan, Literata, Manrope } from "next/font/google";

// Fuentes auto-hospedadas por Next (display=swap + precarga automática).
// Antes se pedían con @import en el CSS: bloqueaba el primer render y en
// mobile se veía el flash blanco / doble pintado del contenido.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-spartan",
  display: "swap",
});
const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-literata",
  display: "swap",
});

// Las fotos en producción salen del Storage de Supabase: preconectar recorta
// un roundtrip del handshake antes de la primera imagen (menos parpadeo).
let supabaseOrigin = null;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin;
  }
} catch {
  supabaseOrigin = null;
}

// Sin dominio todavía: mientras tanto los absolutos apuntan a la URL de
// Workers. Cuando compren el dominio, cambiar SOLO esta línea.
export const metadata = {
  metadataBase: new URL("https://crybe-next.crybe.workers.dev"),
  title: "Centro CRYBE | General Roca, Río Negro",
  description:
    "Centro CRYBE en General Roca, Río Negro. Psicología, psiquiatría, fonoaudiología, psicopedagogía, kinesiología y psicomotricidad. Atención presencial y online.",
  // La imagen sale sola de app/opengraph-image.png. Sin esto, los previews de
  // WhatsApp y redes tomaban el favicon de 16px y lo ampliaban, y salía borroso.
  openGraph: {
    title: "Centro CRYBE | General Roca, Río Negro",
    description:
      "Psicología, psiquiatría, fonoaudiología, psicopedagogía, kinesiología y psicomotricidad en General Roca.",
    type: "website",
    locale: "es_AR",
    siteName: "Centro CRYBE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Centro CRYBE | General Roca, Río Negro",
    description:
      "Psicología, psiquiatría, fonoaudiología, psicopedagogía, kinesiología y psicomotricidad en General Roca.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${spartan.variable} ${literata.variable}`}
    >
      <head>
        {supabaseOrigin ? (
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
        ) : null}
      </head>
      <body className="min-h-screen bg-[#F4F8FB] text-[#1F1F1F] antialiased">
        {children}
      </body>
    </html>
  );
}
