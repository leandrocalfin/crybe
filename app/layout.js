import "./globals.css";

export const metadata = {
  title: "Centro CRYBE | Psicología, Psiquiatría y Neurodesarrollo en General Roca",
  description:
    "Centro CRYBE en General Roca, Río Negro. Psicología, psiquiatría, fonoaudiología, psicopedagogía, kinesiología y psicomotricidad. Atención presencial y online.",
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
