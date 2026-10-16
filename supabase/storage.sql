-- Bucket público para fotos (profesionales, especialidades, blog).
-- Las subidas las hace SOLO el Server Action del admin con service_role,
-- así que no se crean policies de insert: nadie más puede subir.
insert into storage.buckets (id, name, public)
values ('crybe-media', 'crybe-media', true)
on conflict (id) do update set public = true;

-- Límite y tipos del bucket (red de seguridad del lado de Storage):
-- subirFoto valida 4MB y magic bytes en el servidor. En Node sharp reconvierte
-- todo a WebP; en Cloudflare Workers (sin sharp) se sube el original, por eso
-- se permiten también los tipos que acepta el servidor.
update storage.buckets
set file_size_limit = 4194304,
    allowed_mime_types = '{image/webp,image/jpeg,image/png,image/avif}'
where id = 'crybe-media';

-- SIN policy de select: el bucket es público y las imágenes se sirven
-- por su URL directa (getPublicUrl). Una policy de select solo habilitaría
-- que cualquiera con la anon key liste los archivos del bucket con .list().
drop policy if exists "lectura publica media" on storage.objects;
