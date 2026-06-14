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
4. Agrega las variables del proyecto en **Site configuration > Environment variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
NEXT_PUBLIC_SITE_URL=https://tu-dominio.netlify.app
NEXT_PUBLIC_GA_ID=G-Z6RF6G5EVD
NEXT_PUBLIC_ADSENSE_ID=ca-pub-3834473332305596
```

5. Publica el sitio.

## Google Analytics 4

Google Analytics se carga en todas las páginas mediante `components/google-analytics.tsx`.
El componente usa `next/script` con la estrategia `afterInteractive`, evitando bloquear la
carga inicial o producir errores de hidratación.

Para producción, configura `NEXT_PUBLIC_GA_ID` en Netlify y realiza un nuevo despliegue.
Después comprueba las visitas desde **Google Analytics > Informes > En tiempo real**.

## Google AdSense

Google AdSense se carga globalmente mediante `components/google-adsense.tsx`. El script usa
`next/script` con la estrategia `afterInteractive`, por lo que es compatible con App Router,
Netlify y la hidratación de React.

Para producción, configura `NEXT_PUBLIC_ADSENSE_ID` en Netlify y realiza un nuevo despliegue.
La cuenta y el sitio deben estar aprobados en AdSense antes de que aparezcan anuncios.

## Comandos

```bash
npm run dev
npm run build
npm run start
```
