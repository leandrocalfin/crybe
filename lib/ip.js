// IP real del cliente para rate-limits (contacto y login admin).
// En Cloudflare, cf-connecting-ip la fija la plataforma y no se puede
// falsificar; x-forwarded-for sí puede traer valores inventados por el
// cliente (Cloudflare agrega la IP real al final, no pisa lo que venía),
// así que solo sirve como respaldo para desarrollo local.
// PENDIENTE migración Hostinger: ahí no existe cf-connecting-ip y se cae
// al respaldo x-forwarded-for, falsificable según el proxy del hosting.
// Revisar qué header fija su proxy (puede ser x-real-ip o el ÚLTIMO valor
// de x-forwarded-for, no el primero) y ajustar esta función para ese entorno.
// GRAVE: sin el proxy de Cloudflare delante, cualquier visitante puede mandar
// su propio header cf-connecting-ip inventado y esta función lo tomaría
// primero, anulando los límites de login y contacto. Al migrar, dejar de
// leer cf-connecting-ip (o leerlo solo si el sitio sigue detrás del proxy
// de Cloudflare).
export function ipDeHeaders(h) {
  return (
    h.get("cf-connecting-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
