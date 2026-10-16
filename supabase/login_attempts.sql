-- Bloqueo por intentos de login (5 fallidos / 15 min por IP).
-- Solo la service_role lee/escribe: RLS habilitado SIN policies => denegado
-- para anon y authenticated. Ejecutar en Supabase Dashboard > SQL Editor.
create table if not exists public.login_attempts (
  clave text not null,
  created_at timestamptz not null default now()
);
alter table public.login_attempts enable row level security;
create index if not exists login_attempts_clave_created_idx
  on public.login_attempts (clave, created_at desc);
