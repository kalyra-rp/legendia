-- ============================================================
--  Migration 0001 — Table `profils`
-- ------------------------------------------------------------
--  Un profil par compte connecté (extension de auth.users),
--  avec un rôle (membre / moderateur / admin), créé
--  automatiquement à l'inscription, et protégé par RLS.
--
--  Exécutée le 2026-06-01 via l'éditeur SQL Supabase.
--  Note : les blocs 3 et 6 sont des opérations de DONNÉES
--  ponctuelles (backfill + promotion admin), pas du schéma.
-- ============================================================

-- ---- 1) La table -------------------------------------------
create table public.profils (
  -- L'id EST celui du compte auth. Compte supprimé → profil supprimé.
  id uuid primary key references auth.users (id) on delete cascade,

  -- Le rôle, au cœur des permissions. Par défaut : "membre".
  role text not null default 'membre'
    check (role in ('membre', 'moderateur', 'admin')),

  pseudo text,
  avatar_url text,
  cree_le timestamptz not null default now()
);

-- ---- 2) Création automatique du profil à l'inscription -----
create function public.gerer_nouvel_utilisateur()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profils (id, pseudo, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'user_name',
      new.email
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger au_nouvel_utilisateur
  after insert on auth.users
  for each row
  execute procedure public.gerer_nouvel_utilisateur();

-- ---- 3) Backfill des comptes déjà existants (one-off) ------
insert into public.profils (id, pseudo, avatar_url)
select
  u.id,
  coalesce(
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name',
    u.raw_user_meta_data ->> 'user_name',
    u.email
  ),
  u.raw_user_meta_data ->> 'avatar_url'
from auth.users u
on conflict (id) do nothing;

-- ---- 4) RLS : on ferme, puis on autorise au cas par cas ----
alter table public.profils enable row level security;

-- Lire SON propre profil.
create policy "Lire mon profil"
on public.profils
for select
to authenticated
using ( (select auth.uid()) = id );

-- Modifier SON propre profil.
create policy "Modifier mon profil"
on public.profils
for update
to authenticated
using ( (select auth.uid()) = id )
with check ( (select auth.uid()) = id );

-- ---- 5) Verrou colonne : pas d'auto-promotion en admin -----
-- RLS = quelles LIGNES ; GRANT = quelles COLONNES. On ne laisse
-- modifier que pseudo + avatar_url (jamais "role").
revoke update on public.profils from authenticated;
grant  update (pseudo, avatar_url) on public.profils to authenticated;

-- ---- 6) Promotion admin de la fondatrice (one-off) ---------
update public.profils p
set role = 'admin'
from auth.users u
where p.id = u.id
  and u.email = 'contact@mind-and-more.com';

-- ---- 7) Vérification (lecture seule) -----------------------
-- select p.id, u.email, p.pseudo, p.role, p.cree_le
-- from public.profils p
-- join auth.users u on u.id = p.id;
