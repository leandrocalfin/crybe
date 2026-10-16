-- Hero independiente por especialidad (Inicio) separado de la tarjeta.
alter table especialidades add column if not exists hero_titulo text default '';
alter table especialidades add column if not exists hero_subtitulo text default '';
alter table especialidades add column if not exists hero_imagen text default '';

-- Arranque: el hero copia lo actual para que nada cambie visualmente.
update especialidades set hero_titulo = titulo where coalesce(hero_titulo, '') = '';
update especialidades set hero_subtitulo = descripcion where coalesce(hero_subtitulo, '') = '';
update especialidades set hero_imagen = imagen where coalesce(hero_imagen, '') = '';
