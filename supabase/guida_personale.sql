-- Post-it e preferiti della guida DBT: dati PRIVATI, uno per utente.
-- Da eseguire una volta sola in Supabase -> SQL Editor.
-- Nessuna policy per il terapeuta: solo chi ha scritto i dati puo' leggerli.

create table if not exists public.guida_personale (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.guida_personale enable row level security;

drop policy if exists "guida_personale_select" on public.guida_personale;
drop policy if exists "guida_personale_insert" on public.guida_personale;
drop policy if exists "guida_personale_update" on public.guida_personale;
drop policy if exists "guida_personale_delete" on public.guida_personale;

create policy "guida_personale_select" on public.guida_personale
  for select to authenticated using (auth.uid() = user_id);
create policy "guida_personale_insert" on public.guida_personale
  for insert to authenticated with check (auth.uid() = user_id);
create policy "guida_personale_update" on public.guida_personale
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "guida_personale_delete" on public.guida_personale
  for delete to authenticated using (auth.uid() = user_id);
