-- Fix rápido si ya corriste schema.sql y la lectura pública da "permission denied".
-- (Pasa cuando el proyecto se creó con "Exponer automáticamente nuevas tablas" apagado.)
grant usage on schema public to anon, authenticated;
grant select on profesionales to anon;
grant select on especialidades to anon;
grant select on novedades to anon;
revoke all on contactos from anon;
grant select, update, delete on contactos to authenticated;
grant all on profesionales to authenticated;
grant all on novedades to authenticated;
grant all on especialidades to authenticated;
grant select on admins to authenticated;
grant execute on function is_admin() to anon, authenticated;
