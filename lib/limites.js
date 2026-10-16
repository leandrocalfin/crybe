// Límites de contenido compartidos entre el panel (cliente) y las Server
// Actions. Viven acá para que el contador de la UI y el `throw` del servidor
// nunca se desincronicen.

// Máximo de palabras de la descripción de la sección Nosotros.
// El texto actual tiene 61, así que el tope deja duplicarlo con holgura.
export const MAX_PALABRAS_DESCRIPCION = 120;

export function contarPalabras(texto) {
  const limpio = String(texto || "").trim();
  if (!limpio) return 0;
  return limpio.split(/\s+/).filter(Boolean).length;
}