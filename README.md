# SysTools Perú

Web moderna de herramientas, sistemas, descargas, tutoriales y noticias de tecnología. Construida con Next.js App Router, TypeScript, TailwindCSS y Supabase.

## Ejecutar localmente

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Sin variables de Supabase, las páginas públicas muestran contenido de demostración.

## Conectar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Abre **SQL Editor**, pega el contenido de `supabase/schema.sql` y ejecútalo.
3. En **Authentication > Users**, crea el usuario que tendrá acceso al panel.
4. Copia `.env.example` como `.env.local`.
5. En **Project Settings > API**, copia la URL y la clave `anon`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
```

6. Reinicia el servidor y entra a `/admin`.

El esquema activa RLS: visitantes solo leen contenido publicado y cualquier usuario autenticado puede administrar contenido. Para una instalación con varios usuarios, conviene agregar roles de administrador específicos.

## Panel administrador

Desde `/admin` se pueden crear, editar y eliminar artículos, sistemas, herramientas y descargas. También permite:

- Publicar o guardar como borrador.
- Pegar una URL de imagen o subirla al bucket público `images`.
- Pegar enlaces externos de Google Drive, Mega, OneDrive, GitHub Releases u otra nube.

Las descargas no se guardan en Netlify ni en Supabase Storage.

## Subir a Netlify

1. Sube el proyecto a un repositorio Git.
2. En Netlify, selecciona **Add new site > Import an existing project**.
3. El repositorio ya incluye `netlify.toml` con el comando `npm run build`.
4. Agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en **Site configuration > Environment variables**.
5. Publica el sitio.

## Comandos

```bash
npm run dev
npm run build
npm run start
```
