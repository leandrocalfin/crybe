import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Aviso una sola vez por isolate: sin estas vars el sitio público igual
// renderiza (cae a los datos locales de data/) y el panel queda vacío,
// así que es el fallo más difícil de detectar y hay que decirlo.
let avisóFaltaConfig = false;

// Cliente con la sesión del admin (cookies). Respeta RLS: solo lo que
// las policies permiten (is_admin) se puede leer/escribir.
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    if (!avisóFaltaConfig) {
      avisóFaltaConfig = true;
      console.error(
        `[supabase] falta NEXT_PUBLIC_SUPABASE_URL=${!!url} / NEXT_PUBLIC_SUPABASE_ANON_KEY=${!!anonKey}. ` +
          "En Cloudflare son variables de BUILD, no runtime (ver wrangler.jsonc).",
      );
    }
    return null;
  }
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Llamado desde un Server Component: lo aplica el middleware.
        }
      },
    },
  });
}

// Devuelve { sb, user, isAdmin }. Doble puerta: sesión + fila en tabla admins.
export async function getAdminUser() {
  const sb = await getSupabaseServer();
  if (!sb) return { sb: null, user: null, isAdmin: false };
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { sb, user: null, isAdmin: false };
  const { data, error } = await sb
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  // `data: null` sin error = la fila no existe (usuario no admin). Con error
  // es otra cosa (tabla/grants/policy) y el "Sin acceso" del panel sería
  // engañoso, así que se registra en vez de tragárselo.
  if (error) {
    console.error(`[admin] no se pudo leer la tabla admins: ${error.code} ${error.message}`);
  }
  return { sb, user, isAdmin: !!data };
}
