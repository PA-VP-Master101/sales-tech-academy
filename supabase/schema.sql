-- =====================================================================
-- Sales Tech Academy : comptes utilisateurs et progression des apprenants
--
-- À exécuter une fois dans Supabase : SQL Editor > New query > coller > Run.
-- Le script peut être relancé sans risque : il ne supprime aucune donnée.
-- =====================================================================


-- 1. La progression de chaque apprenant (une ligne par compte) ----------

create table if not exists public.progress (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  email         text,
  name          text not null default '',
  data          jsonb not null default '{}'::jsonb,
  sessions_done integer not null default 0,
  xp            integer not null default 0,
  exam_best     integer not null default 0,
  exam_passed   boolean not null default false,
  last_active   date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);


-- 2. Garde-fous : l'e-mail et les dates sont fixés par la base, ---------
--    jamais par le navigateur, et la taille des données est limitée.

create or replace function public.progress_stamp()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.email := (select u.email from auth.users u where u.id = new.user_id);
  new.updated_at := now();
  if tg_op = 'UPDATE' then
    new.created_at := old.created_at;
  else
    new.created_at := now();
  end if;
  if pg_column_size(new.data) > 262144 then
    raise exception 'Progression trop volumineuse';
  end if;
  return new;
end;
$$;

drop trigger if exists progress_stamp on public.progress;
create trigger progress_stamp
  before insert or update on public.progress
  for each row execute function public.progress_stamp();


-- 3. Les administrateurs : eux seuls voient tous les apprenants ---------

create table if not exists public.admins (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- Aucune règle d'accès sur cette table : personne ne peut la lire ni la
-- modifier depuis le site. Elle se gère uniquement ici, dans le SQL Editor.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;


-- 4. Règles d'accès (Row Level Security) --------------------------------
--    Chaque apprenant ne lit et n'écrit que sa propre ligne.
--    Un administrateur peut en plus lire toutes les lignes.

alter table public.progress enable row level security;

drop policy if exists "progress_select" on public.progress;
create policy "progress_select" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));

drop policy if exists "progress_insert" on public.progress;
create policy "progress_insert" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_update" on public.progress;
create policy "progress_update" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_delete" on public.progress;
create policy "progress_delete" on public.progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.progress from anon;
grant select, insert, update, delete on public.progress to authenticated;


-- 5. Suppression de son compte par l'apprenant lui-même -----------------
--    Efface le compte ; la progression part avec (on delete cascade).

create or replace function public.delete_me()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Non connecté';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;


-- 6. Qui peut appeler ces fonctions depuis le site ----------------------

revoke execute on function public.is_admin()  from public, anon;
grant  execute on function public.is_admin()  to authenticated;
revoke execute on function public.delete_me() from public, anon;
grant  execute on function public.delete_me() to authenticated;


-- 7. À faire APRÈS avoir créé ton propre compte sur le site -------------
--    Remplace l'adresse ci-dessous par celle de ton compte, puis exécute
--    seulement ces trois lignes (sélectionne-les, puis Run).
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = lower('ton-adresse@exemple.com')
-- on conflict (user_id) do nothing;
