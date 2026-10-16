-- Bandeja estilo email: columna leído (la columna estado queda en desuso).
alter table contactos add column if not exists leido boolean default false;
-- Los mensajes viejos marcados como contactado/cerrado se consideran leídos.
update contactos set leido = true where estado in ('contactado', 'cerrado');
