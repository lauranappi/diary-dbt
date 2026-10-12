-- Promemoria push: una riga per ogni telefono/browser che ha attivato le notifiche.
-- Da eseguire una volta sola in Supabase -> SQL Editor.
-- L'app scrive solo le righe dell'utente collegato; l'invio lo fa un'azione
-- programmata su GitHub con la chiave "service role" (che aggira queste regole).

create table if not exists public.push_iscrizioni (
  endpoint     text primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  subscription jsonb not null,
  ora          text not null default '21:00',
  fuso         text not null default 'Europe/Rome',
  attivo       boolean not null default true,
  compilato_il date,
  ultimo_invio date,
  updated_at   timestamptz not null default now()
);

alter table public.push_iscrizioni enable row level security;

drop policy if exists "push_select" on public.push_iscrizioni;
drop policy if exists "push_insert" on public.push_iscrizioni;
drop policy if exists "push_update" on public.push_iscrizioni;
drop policy if exists "push_delete" on public.push_iscrizioni;

create policy "push_select" on public.push_iscrizioni
  for select to authenticated using (auth.uid() = user_id);
create policy "push_insert" on public.push_iscrizioni
  for insert to authenticated with check (auth.uid() = user_id);
create policy "push_update" on public.push_iscrizioni
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "push_delete" on public.push_iscrizioni
  for delete to authenticated using (auth.uid() = user_id);
