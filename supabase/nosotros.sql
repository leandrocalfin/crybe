-- ============================================
-- CRYBE · Sección Nosotros (título + descripción + ítems)
-- Pegar en SQL Editor > New query > Run
-- ============================================

-- Cabeceras de sección (nosotros, y a futuro alquiler, etc.)
create table if not exists secciones (
  slug text primary key,
  titulo text default '',
  descripcion text default ''
);
alter table secciones enable row level security;
drop policy if exists "lectura publica secciones" on secciones;
create policy "lectura publica secciones" on secciones for select to anon using (true);
drop policy if exists "secciones admin escribe" on secciones;
create policy "secciones admin escribe" on secciones for all to authenticated using (is_admin()) with check (is_admin());

-- Ítems de Nosotros (pilares). Máx 8 se controla en el panel.
create table if not exists nosotros_items (
  id uuid default gen_random_uuid() primary key,
  icono text not null default 'Sparkles' check (icono in (
    'Handshake','Brain','Network','Sprout','Users','ClipboardCheck',
    'HeartHandshake','Armchair','Sparkles','Heart','Star','Baby','Lightbulb'
  )),
  titulo text not null check (char_length(titulo) between 2 and 60),
  texto text not null check (char_length(texto) between 10 and 500),
  orden int default 0,
  activo boolean default true,
  created_at timestamptz default now()
);
alter table nosotros_items enable row level security;
drop policy if exists "lectura publica nosotros" on nosotros_items;
create policy "lectura publica nosotros" on nosotros_items for select to anon using (activo = true);
drop policy if exists "nosotros admin escribe" on nosotros_items;
create policy "nosotros admin escribe" on nosotros_items for all to authenticated using (is_admin()) with check (is_admin());

-- Cabecera de la sección Especialidades del sitio
do $$ begin
  if not exists (select 1 from secciones where slug = 'especialidades') then
    insert into secciones (slug, titulo, descripcion) values
    ('especialidades',
     'Acompañamiento para cada etapa',
     'Un equipo interdisciplinario que trabaja de forma complementaria según las necesidades de cada persona.');
  end if;
end $$;

-- Seed con el contenido actual del sitio (solo si está vacío: repetible sin duplicar)
do $$ begin
  if not exists (select 1 from secciones where slug = 'nosotros') then
    insert into secciones (slug, titulo, descripcion) values
    ('nosotros',
     'Un espacio cálido donde la salud mental y la rehabilitación convergen',
     'En CRYBE creemos que el bienestar se construye a través de un acompañamiento profesional, humano e integral. Somos un centro dedicado a la rehabilitación y al bienestar emocional, donde diferentes disciplinas trabajan de manera complementaria para acompañar las necesidades de cada persona.

Nuestro objetivo es brindar un espacio de escucha, comprensión y acompañamiento, respetando los tiempos y particularidades de cada proceso.');
  end if;
  if not exists (select 1 from nosotros_items) then
    insert into nosotros_items (icono, titulo, texto, orden) values
    ('Handshake', 'Acompañamiento', 'Un espacio donde puedas sentirte escuchado y acompañado durante cada etapa de tu proceso.', 1),
    ('Brain', 'Enfoque integral', 'Profesionales de distintas áreas que pueden trabajar de manera complementaria según cada necesidad.', 2),
    ('Network', 'Abordaje interdisciplinario', 'Realizamos ateneos clínicos y reuniones periódicas entre psicólogos, psicopedagogos, fonoaudiólogos y kinesiólogos para diseñar planes terapéuticos sinérgicos e integrados.', 3),
    ('Sprout', 'Bienestar', 'Buscamos favorecer herramientas que contribuyan al desarrollo y bienestar de cada persona.', 4),
    ('Users', 'Orientación familiar', 'Acompañamiento para padres y docentes que quieren ayudar mejor desde casa y la escuela.', 5),
    ('ClipboardCheck', 'Evaluación diagnóstica', 'Evaluaciones ajustadas a cada situación. Identificamos el origen real antes de cualquier intervención.', 6),
    ('HeartHandshake', 'Calidez humana y ética', 'Priorizamos la empatía activa, la escucha sin juzgar y el respeto absoluto a los tiempos de cada individuo y de su grupo familiar durante todo el tratamiento.', 7),
    ('Armchair', 'Entornos tranquilos', 'Consultorios con iluminación natural, climatización individual y mobiliario específico para neurorehabilitación y juego simbólico.', 8);
  end if;
end $$;

-- Grants (proyecto con auto-expose apagado)
grant select on secciones to anon;
grant all on secciones to authenticated;
grant select on nosotros_items to anon;
grant all on nosotros_items to authenticated;
grant all on all tables in schema public to service_role;
