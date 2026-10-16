import "./globals.css";

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
    <html lang="es">
      <body className="min-h-screen bg-[#F4F8FB] text-[#1F1F1F] antialiased">
        {children}
      </body>
    </html>
  );
}
