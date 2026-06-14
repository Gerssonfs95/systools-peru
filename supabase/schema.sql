-- SysTools Perú: ejecutar en Supabase > SQL Editor
create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text default '',
  content text default '',
  image_url text default '',
  category text default 'General',
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.systems (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text default '',
  version text default '',
  image_url text default '',
  download_url text default '',
  category text default 'General',
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text default '',
  icon text default '',
  category text default 'General',
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  version text default '',
  image_url text default '',
  download_url text default '',
  category text default 'General',
  published boolean default false,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;
alter table public.systems enable row level security;
alter table public.tools enable row level security;
alter table public.downloads enable row level security;

create policy "Public can read published posts" on public.posts for select using (published = true or auth.role() = 'authenticated');
create policy "Public can read published systems" on public.systems for select using (published = true or auth.role() = 'authenticated');
create policy "Public can read published tools" on public.tools for select using (published = true or auth.role() = 'authenticated');
create policy "Public can read published downloads" on public.downloads for select using (published = true or auth.role() = 'authenticated');

create policy "Admin manages posts" on public.posts for all to authenticated using (true) with check (true);
create policy "Admin manages systems" on public.systems for all to authenticated using (true) with check (true);
create policy "Admin manages tools" on public.tools for all to authenticated using (true) with check (true);
create policy "Admin manages downloads" on public.downloads for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

create policy "Public reads images" on storage.objects for select using (bucket_id = 'images');
create policy "Admin uploads images" on storage.objects for insert to authenticated with check (bucket_id = 'images');
create policy "Admin updates images" on storage.objects for update to authenticated using (bucket_id = 'images');
create policy "Admin deletes images" on storage.objects for delete to authenticated using (bucket_id = 'images');
