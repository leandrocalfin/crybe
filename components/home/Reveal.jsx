"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Entrada por scroll solo en desktop con mouse. En táctil (celu/tablet) cada
// tarjeta pasaba por opacity 0 mientras el navegador decodificaba imágenes y
// componía el scroll: se veía como parpadeo en Especialidades/Equipo/Recursos.
// Ahí se renderiza el contenido final directo, sin animación.
const Reveal = ({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.55,
  amount = 0.2,
  as = "div",
  onClick,
}) => {
  // Arranca en true para que el primer render del cliente coincida con el
  // del servidor (sin warning de hidratación); el efecto lo apaga en táctil.
  const [animar, setAnimar] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const aplicar = () => setAnimar(!mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  if (!animar) {
    if (as === "article") return <article className={className} onClick={onClick}>{children}</article>;
    return <div className={className} onClick={onClick}>{children}</div>;
  }

  const MotionTag = as === "article" ? motion.article : motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay }}
      className={className}
      onClick={onClick}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
