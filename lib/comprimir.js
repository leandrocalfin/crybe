// Compresión en el navegador antes de subir: fotos web a máx 1600px,
// JPEG calidad 82% (imperceptible en pantalla, ~70% menos peso).
// PNG chicos se dejan intactos para no romper transparencias ni logos.
export async function comprimirImagen(file, { maxLado = 1600, calidad = 0.82 } = {}) {
  try {
    if (!file?.type?.startsWith("image/")) return file;
    if (file.type === "image/png" && file.size <= 1024 * 1024) return file;
    if (typeof createImageBitmap === "undefined") return file;
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height));
    if (escala === 1 && file.size <= 400 * 1024) {
      bitmap.close?.();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * escala));
    canvas.height = Math.max(1, Math.round(bitmap.height * escala));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const tipo = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise((res) => canvas.toBlob(res, tipo, calidad));
    if (!blob) return file;
    const base = (file.name || "imagen").replace(/\.[^.]+$/, "") || "imagen";
    return new File([blob], `${base}.${tipo === "image/png" ? "png" : "jpg"}`, { type: tipo });
  } catch {
    return file;
  }
}
