-- Defensa en profundidad: ninguna policy anónima usa is_admin(),
-- así que anon no necesita ejecutarla. Ejecutar en Supabase Dashboard > SQL Editor.
revoke execute on function public.is_admin() from anon;
