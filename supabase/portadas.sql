-- ============================================
-- CRYBE · Portadas del Inicio (hero, independiente de especialidades)
-- ============================================

create table if not exists portadas (
  id uuid default gen_random_uuid() primary key,
  nombre text not null default '' check (char_length(nombre) <= 80),
  titulo text not null default '' check (char_length(titulo) <= 200),
  subtitulo text not null default '' check (char_length(subtitulo) <= 600),
  imagen text not null default '' check (char_length(imagen) <= 500),
  orden int default 0,
  activo boolean default true,
  created_at timestamptz default now()
);
alter table portadas enable row level security;
drop policy if exists "lectura publica portadas" on portadas;
create policy "lectura publica portadas" on portadas for select to anon using (activo = true);
drop policy if exists "portadas admin escribe" on portadas;
create policy "portadas admin escribe" on portadas for all to authenticated using (is_admin()) with check (is_admin());

grant select on portadas to anon;
grant all on portadas to authenticated;
grant all on all tables in schema public to service_role;

-- Seed inicial copiando lo actual (solo si está vacía: repetible).
do $$ begin
  if not exists (select 1 from portadas) then
    insert into portadas (nombre, titulo, subtitulo, imagen, orden, activo)
    select
      nombre,
      titulo,
      descripcion,
      imagen,
      row_number() over (),
      true
    from especialidades;
  end if;
end $$;
