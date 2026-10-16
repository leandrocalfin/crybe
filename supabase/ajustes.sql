-- ============================================
-- CRYBE · Ajustes del sitio (datos y redes)
-- Clave/valor: whatsapp, teléfono, email, redes, dirección, horarios, mapa
-- ============================================

create table if not exists ajustes (
  clave text primary key,
  valor text default '',
  updated_at timestamptz default now()
);
alter table ajustes enable row level security;
drop policy if exists "lectura publica ajustes" on ajustes;
create policy "lectura publica ajustes" on ajustes for select to anon using (true);
drop policy if exists "ajustes admin escribe" on ajustes;
create policy "ajustes admin escribe" on ajustes for all to authenticated using (is_admin()) with check (is_admin());

grant select on ajustes to anon;
grant all on ajustes to authenticated;
grant all on all tables in schema public to service_role;

-- Seed con los valores actuales (solo claves faltantes: repetible)
insert into ajustes (clave, valor) values
('whatsapp', '5492984254590'),
('telefono', '298 425-4590'),
('email', 'info@crybe.com.ar'),
('instagram', 'https://www.instagram.com/centrocrybe/'),
('facebook', ''),
('direccion', 'Tucumán 445, General Roca · Río Negro'),
('direccion_corta', 'Tucuman 445, General Roca'),
('mapa', 'Tucuman 445, General Roca, Rio Negro'),
('horario_lv', 'Lunes a Viernes: 08:00 a 20:00 hs'),
('horario_sab', 'Sábados: 09:00 a 13:00 hs'),
('avatar', '')
on conflict (clave) do nothing;
