import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cliente público (lecturas + insert de contactos).
// Si no hay env configurado, devuelve null y las páginas usan datos locales.
export function getSupabaseBrowser() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
