-- ============================================
-- CRYBE · Supabase schema ENDURECIDO v2
-- Pegar en Supabase Dashboard > SQL Editor > New query > Run
-- Corrige: sin insert público (solo Server Action con service_role),
-- admins reales vía tabla admins, FKs y listas cerradas.
-- ============================================

-- 0) ADMINS (quién puede leer contactos y editar contenido)
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);
alter table admins enable row level security;
-- Cada admin puede verse a sí mismo; el resto lo gestiona is_admin() (security definer).
drop policy if exists "admins read own" on admins;
create policy "admins read own" on admins for select to authenticated using (auth.uid() = user_id);

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- 1) CONTACTOS
create table if not exists contactos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null check (char_length(nombre) between 2 and 80),
  telefono text not null check (telefono ~ '^[+0-9() \-]{6,25}$'),
  email text check (email is null or email = '' or email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  motivo text not null check (motivo in (
    'Consulta clínica general / Especialidades',
    'Alquiler de consultorios / Módulos',
    'Quiero formar parte del equipo',
    'Turnos y horarios'
  )),
  mensaje text not null check (char_length(mensaje) between 10 and 1000),
  estado text not null default 'nuevo' check (estado in ('nuevo','contactado','cerrado')),
  ip_hash text,
  created_at timestamptz default now()
);
alter table contactos enable row level security;

-- Cierre total del insert público: NINGUNA policy de insert para anon/authenticated.
-- El único que inserta es el Server Action con SUPABASE_SERVICE_ROLE_KEY (bypassa RLS).
drop policy if exists "insert publico" on contactos;
drop policy if exists "insert publico validado" on contactos;

-- Lectura solo admins reales (no cualquier logueado).
drop policy if exists "solo admin lee" on contactos;
drop policy if exists "contactos solo admins" on contactos;
create policy "contactos solo admins" on contactos for select to authenticated using (is_admin());
-- Update/delete también solo admins (para gestionar estados desde el panel).
drop policy if exists "contactos admin update" on contactos;
create policy "contactos admin update" on contactos for update to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "contactos admin delete" on contactos;
create policy "contactos admin delete" on contactos for delete to authenticated using (is_admin());

create index if not exists contactos_created_idx on contactos (created_at desc);
create index if not exists contactos_ip_created_idx on contactos (ip_hash, created_at desc);

-- 2) ESPECIALIDADES (se crea antes para poder referenciarla con FK)
create table if not exists especialidades (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  nombre text not null,
  titulo text,
  descripcion text,
  imagen text
);
alter table especialidades enable row level security;
drop policy if exists "lectura publica especialidades" on especialidades;
create policy "lectura publica especialidades" on especialidades for select to anon using (true);
drop policy if exists "admin todo especialidades" on especialidades;
drop policy if exists "especialidades admin escribe" on especialidades;
create policy "especialidades admin escribe" on especialidades for all to authenticated using (is_admin()) with check (is_admin());

-- 3) PROFESIONALES (solo lectura pública, escritura solo admins)
create table if not exists profesionales (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  nombre text not null,
  especialidad text not null,
  especialidad_slug text not null,
  modalidad text,
  foto_url text,
  matricula text,
  resumen text,
  descripcion text,
  whatsapp text,
  dias text[] default '{}',
  horarios text default '',
  mostrar_horarios boolean default true,
  areas text[] default '{}',
  activo boolean default true,
  orden int default 0,
  created_at timestamptz default now()
);
alter table profesionales enable row level security;
drop policy if exists "lectura publica profesionales" on profesionales;
create policy "lectura publica profesionales" on profesionales for select to anon using (activo = true);
drop policy if exists "admin todo profesionales" on profesionales;
drop policy if exists "profesionales admin escribe" on profesionales;
create policy "profesionales admin escribe" on profesionales for all to authenticated using (is_admin()) with check (is_admin());

-- FK: evita typos en especialidad_slug (relación real con especialidades.slug).
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profesionales_especialidad_fk') then
    alter table profesionales
      add constraint profesionales_especialidad_fk
      foreign key (especialidad_slug) references especialidades(slug)
      on update cascade on delete restrict;
  end if;
end $$;

-- 4) NOVEDADES / BLOG (categoría cerrada + solo admins escriben)
create table if not exists novedades (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  categoria text check (categoria is null or categoria in (
    'Psicología','Psiquiatría','Fonoaudiología','Psicopedagogía',
    'Kinesiología y Psicomotricidad','Equipo CRYBE'
  )),
  titulo text not null,
  descripcion text,
  cuerpo text[] default '{}',
  imagen_principal text,
  galeria text[] default '{}',
  autor text,
  fecha_publicacion date default current_date,
  publicado boolean default true,
  created_at timestamptz default now()
);
alter table novedades enable row level security;
drop policy if exists "lectura publica novedades" on novedades;
create policy "lectura publica novedades" on novedades for select to anon using (publicado = true);
drop policy if exists "admin todo novedades" on novedades;
drop policy if exists "novedades admin escribe" on novedades;
create policy "novedades admin escribe" on novedades for all to authenticated using (is_admin()) with check (is_admin());

-- ¿Cómo te hacés admin? (después de crear tu usuario en Authentication > Users):
--   insert into admins (user_id, email) values ('TU-USER-UUID', 'tu@email.com');
-- Tu UUID lo ves en Authentication > Users > clic en tu usuario.

-- 5) GRANTS (obligatorio si desactivaste "Exponer automáticamente nuevas tablas":
--    sin esto, las policies existen pero la API devuelve "permission denied").
grant usage on schema public to anon, authenticated;
grant select on profesionales to anon;
grant select on especialidades to anon;
grant select on novedades to anon;
-- contactos: anon sin grants = ni siquiera intenta el insert (rebota antes de RLS).
revoke all on contactos from anon;
grant select, update, delete on contactos to authenticated;
grant all on profesionales to authenticated;
grant all on novedades to authenticated;
grant all on especialidades to authenticated;
grant select on admins to authenticated;
grant execute on function is_admin() to anon, authenticated;
