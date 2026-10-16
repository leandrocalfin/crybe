-- Fix: service_role sin grants (proyectos con auto-expose apagado).
-- Sin esto el Server Action recibe "permission denied for table contactos".
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
