"use client";
const Acuarela = ({ variante = "ambas" }) => {
  const mostrarArriba = variante === "ambas" || variante === "arriba";
  const mostrarAbajo = variante === "ambas" || variante === "abajo";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {mostrarArriba && (
        <>
          <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-[45%_55%_52%_48%/50%_45%_55%_50%] bg-[#D8E5F1]/70 blur-3xl md:h-[520px] md:w-[520px]" />
          <div className="absolute -right-16 top-24 h-[220px] w-[220px] rounded-[55%_45%_48%_52%/45%_55%_45%_55%] bg-[#EAF1F7]/80 blur-2xl" />
        </>
      )}

      {mostrarAbajo && (
        <>
          <div className="absolute -bottom-40 -left-32 h-[440px] w-[440px] rounded-[52%_48%_45%_55%/55%_50%_50%_45%] bg-[#E2EBF3]/70 blur-3xl md:h-[540px] md:w-[540px]" />
          <div className="absolute -left-10 bottom-28 h-[200px] w-[200px] rounded-[48%_52%_55%_45%/50%_48%_52%_50%] bg-[#EFF5FA]/80 blur-2xl" />
        </>
      )}
    </div>
  );
};

export default Acuarela;

