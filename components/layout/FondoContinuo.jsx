"use client";
// Los blobs con blur grande fijos sobre toda la página obligan a la GPU a
// repintar áreas enormes en cada scroll. Solo se renderizan en desktop (lg+):
// en celu y tablet traban el scroll y no aportan nada sobre el fondo claro.
const FondoContinuo = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {/* Superior derecha - Hero: eliminada para foto nítida */}

      {/* Media izquierda - Nosotros / Equipo */}
      <div className="absolute -left-48 top-[28%] h-[600px] w-[600px] rounded-[52%_48%_45%_55%/55%_50%_50%_45%] bg-[#E2EBF3]/50 blur-3xl" />

      {/* Media derecha - Especialidades */}
      <div className="absolute -right-52 top-[52%] h-[620px] w-[620px] rounded-[48%_52%_55%_45%/50%_48%_52%_50%] bg-[#D8E5F1]/45 blur-3xl" />

      {/* Inferior izquierda - Novedades / Contacto */}
      <div className="absolute -left-44 top-[76%] h-[640px] w-[640px] rounded-[52%_48%_45%_55%/55%_50%_50%_45%] bg-[#E2EBF3]/55 blur-3xl" />
      <div className="absolute -left-16 top-[84%] h-[220px] w-[220px] rounded-[48%_52%_55%_45%/50%_48%_52%_50%] bg-[#EFF5FA]/70 blur-2xl" />
    </div>
  );
};

export default FondoContinuo;

