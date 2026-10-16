import {
  Handshake,
  Brain,
  Network,
  Sprout,
  Users,
  ClipboardCheck,
  HeartHandshake,
  Armchair,
  Sparkles,
  Heart,
  Star,
  Baby,
  Lightbulb,
} from "lucide-react";

// Nombres de icono válidos en DB (nosotros_items.icono) → componente.
export const ICONOS = {
  Handshake,
  Brain,
  Network,
  Sprout,
  Users,
  ClipboardCheck,
  HeartHandshake,
  Armchair,
  Sparkles,
  Heart,
  Star,
  Baby,
  Lightbulb,
};

export const ICONOS_NOMBRES = Object.keys(ICONOS);

// Etiquetas en español para el panel (en DB se guarda la clave original).
export const ICONOS_ETIQUETAS = {
  Handshake: "Apretón de manos",
  Brain: "Cerebro",
  Network: "Red de apoyo",
  Sprout: "Planta",
  Users: "Personas",
  ClipboardCheck: "Evaluación",
  HeartHandshake: "Manos con corazón",
  Armchair: "Sillón",
  Sparkles: "Destellos",
  Heart: "Corazón",
  Star: "Estrella",
  Baby: "Bebé",
  Lightbulb: "Idea",
};

export function Icono({ nombre, size = 18 }) {
  const C = ICONOS[nombre] || Sparkles;
  return <C size={size} strokeWidth={1.8} />;
}
