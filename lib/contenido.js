import { createClient } from "@supabase/supabase-js";

// Lecturas públicas del sitio (anon key, sin sesión). Si Supabase no está
// configurado o falla, devuelve null y cada sección usa sus datos locales.
function pub() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function getContenidoPublico() {
  const sb = pub();
  if (!sb) return null;
  try {
    const [esp, prof, nov, secs, nosItems, ajus, port] = await Promise.all([
      sb.from("especialidades").select("*"),
      sb.from("profesionales").select("*").eq("activo", true).order("orden", { ascending: true }),
      sb.from("novedades").select("*").eq("publicado", true).order("fecha_publicacion", { ascending: false }),
      sb.from("secciones").select("*"),
      sb.from("nosotros_items").select("*").eq("activo", true).order("orden", { ascending: true }),
      sb.from("ajustes").select("*"),
      sb.from("portadas").select("*").eq("activo", true).order("orden", { ascending: true }),
    ]);
    if (esp.error || prof.error || nov.error) return null;
    const mapaSec = {};
    (secs.data || []).forEach((s) => { mapaSec[s.slug] = s; });
    const ajustes = {};
    (ajus.data || []).forEach((a) => { ajustes[a.clave] = a.valor || ""; });
    return {
      ajustes,
      // Hero: tabla propia `portadas` (Inicio). Fallback a especialidades y luego a datos locales.
      hero: (port.data || []).map((p) => ({
        id: p.id,
        nombre: p.nombre,
        titulo: p.titulo || p.nombre,
        descripcion: p.subtitulo || "",
        imagen: p.imagen || "",
      })).concat(
        !(port.data || []).length
          ? (esp.data || []).map((e) => ({
              id: e.slug,
              nombre: e.nombre,
              titulo: e.hero_titulo || e.titulo || e.nombre,
              descripcion: e.hero_subtitulo || e.descripcion || "",
              imagen: e.hero_imagen || e.imagen || "",
            }))
          : []
      ),
      // Sección Especialidades: tarjetas con descripción propia
      especialidades: (esp.data || []).map((e) => ({
        slug: e.slug,
        nombre: e.nombre,
        tag: null,
        descripcion: e.descripcion || "",
        imagen: e.imagen || "",
      })),
      profesionales: (prof.data || []).map((p) => ({
        id: p.id,
        slug: p.slug,
        nombre: p.nombre,
        especialidad: p.especialidad,
        especialidadSlug: p.especialidad_slug,
        modalidad: p.modalidad,
        foto: p.foto_url,
        matricula: p.matricula,
        resumen: p.resumen,
        descripcion: p.descripcion,
        whatsapp: p.whatsapp,
        dias: p.dias || [],
        horarios: p.horarios || "",
        mostrarHorarios: p.mostrar_horarios,
        areas: p.areas || [],
        activo: p.activo,
      })),
      novedades: (nov.data || []).map((n) => ({
        id: n.id,
        categoria: n.categoria,
        titulo: n.titulo,
        descripcion: n.descripcion,
        cuerpo: n.cuerpo || [],
        imagen: n.imagen_principal,
        galeria: n.galeria || [],
        autor: n.autor,
        fecha: n.fecha_publicacion
          ? new Date(n.fecha_publicacion + "T12:00:00").toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
      })),
      // Sección Especialidades: cabecera editable + tarjetas
      seccionEspecialidades: mapaSec.especialidades
        ? { titulo: mapaSec.especialidades.titulo || "", descripcion: mapaSec.especialidades.descripcion || "" }
        : null,
      nosotros:
        mapaSec.nosotros || (nosItems.data || []).length
          ? {
              titulo: mapaSec.nosotros?.titulo || "",
              parrafos: (mapaSec.nosotros?.descripcion || "")
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean),
              items: (nosItems.data || []).map((it) => ({
                icono: it.icono,
                titulo: it.titulo,
                texto: it.texto,
              })),
            }
          : null,
    };
  } catch {
    return null;
  }
}
