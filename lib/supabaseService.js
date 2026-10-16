import "server-only";
import { createClient } from "@supabase/supabase-js";

// service_role SOLO servidor (Server Actions del admin). Bypassa RLS:
// cada función que lo usa ya verificó is_admin antes.
export function getSupabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
