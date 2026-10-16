-- Rate limit del formulario de contacto (3 envíos / 10 min por IP).
-- Solo la service_role lee/escribe: RLS habilitado SIN policies => denegado
-- para anon y authenticated. Ejecutar en Supabase Dashboard > SQL Editor.
create table if not exists public.rate_limits (
  ip_hash text not null,
  created_at timestamptz not null default now()
);
alter table public.rate_limits enable row level security;
create index if not exists rate_limits_ip_created_idx
  on public.rate_limits (ip_hash, created_at desc);
