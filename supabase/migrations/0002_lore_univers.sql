-- ============================================================
--  Migration 0002 — Le LORE des univers
-- ------------------------------------------------------------
--  On pose ici toute l'ossature qui stockera la « bible » d'un
--  univers : la ville et ses quartiers, les lieux, les PNJ, les
--  escapades, la culture (+ lexique créole) et le calendrier.
--
--  Principes (rappel de la consigne) :
--   • Approche MIXTE : des champs structurés (nom, slug, ordre,
--     emoji, couleur…) pour les infos précises + des champs
--     TEXTE pour la prose riche, stockée en MARKDOWN (jamais de
--     HTML brut : on évite ainsi toute injection XSS au rendu).
--   • Tout est rattaché à `univers` (FK) : la plateforme est
--     multi-univers, Saint-Pierre n'est que le premier.
--   • RLS partout : lecture = tout membre connecté ;
--     écriture = rôle admin uniquement (via le helper is_admin()).
--   • Conventions reprises de 0001 : noms de tables/colonnes en
--     français snake_case, clés `cree_le` / `modifie_le`.
--
--  Idempotente : `create table if not exists`, triggers et
--  policies (re)posés proprement, et le seed en
--  `insert … on conflict do nothing`. On peut donc la rejouer.
--
--  ⚠️ À exécuter dans l'éditeur SQL Supabase APRÈS validation.
--     La base contient déjà la table `profils` (migration 0001) :
--     cette migration ne la touche pas, elle s'ajoute à côté.
-- ============================================================


-- ============================================================
--  0) Deux helpers réutilisés par TOUTES les tables
-- ============================================================

-- ---- is_admin() : « l'utilisateur courant est-il admin ? » ----
-- On le centralise ici car la même condition d'écriture se répète
-- sur chaque table. `security definer` : la fonction lit
-- public.profils avec les droits de son PROPRIÉTAIRE, donc sans
-- dépendre des policies de `profils` (robuste et prévisible).
-- `set search_path = ''` : on force le schéma explicite partout
-- (public.profils) — c'est la précaution de sécurité standard
-- Supabase contre le détournement de search_path.
-- `stable` : pour une même requête, le résultat ne change pas →
-- Postgres peut l'appeler une seule fois.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.profils
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- ---- touch_modifie_le() : horodate les modifications ----------
-- Un petit trigger BEFORE UPDATE qui remet `modifie_le` à l'heure
-- courante à chaque écriture. Évite d'avoir à y penser dans le code
-- applicatif, et garantit une valeur fiable côté base.
create or replace function public.touch_modifie_le()
returns trigger
language plpgsql
as $$
begin
  new.modifie_le = now();
  return new;
end;
$$;


-- ============================================================
--  1) UNIVERS — la racine de tout le lore
-- ------------------------------------------------------------
--  CHOIX DE MODÉLISATION (fiche d'identité) : les 6 « fact chips »
--  de la bible (Lieu, Population, Climat, Saisons, Aléa, Vibe) sont
--  un petit bloc d'affichage, propre à chaque univers, qu'on lit
--  toujours en entier et que l'admin édite rarement. Plutôt qu'une
--  11ᵉ table (avec sa FK, sa RLS, son tri…) pour 6 lignes purement
--  présentationnelles, je les range en JSONB dans `fiche_identite`.
--  → moins de jointures, lecture en un seul SELECT.
--  (Si un jour on veut filtrer/croiser ces données, on extraira
--   vers une table dédiée — mais ce serait sur-architecturer ici.)
-- ============================================================
create table if not exists public.univers (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,        -- ex : 'saint-pierre-974'
  nom                 text not null,
  sous_titre          text,
  description_courte  text,                         -- markdown
  description_longue  text,                         -- markdown
  statut              text not null default 'preview'
                        check (statut in ('ouvert', 'preview', 'ferme')),
  couleur_principale  text,                         -- hex, ex : '#1fb6ad'
  fiche_identite      jsonb not null default '[]'::jsonb,
  ordre               integer not null default 0,   -- tri d'affichage
  cree_le             timestamptz not null default now(),
  modifie_le          timestamptz not null default now()
);


-- ============================================================
--  2) QUARTIERS — les morceaux de la ville
-- ------------------------------------------------------------
--  CHOIX : `slug` n'est PAS unique globalement mais unique PAR
--  univers (contrainte composite univers_id+slug). Deux univers
--  pourront chacun avoir un quartier 'centre-ville' sans collision.
--  Même logique pour lieux / pnj / escapades / etc. plus bas.
-- ============================================================
create table if not exists public.quartiers (
  id           uuid primary key default gen_random_uuid(),
  univers_id   uuid not null references public.univers (id) on delete cascade,
  slug         text not null,
  nom          text not null,
  sous_titre   text,
  emoji        text,
  couleur      text,                       -- hex
  ordre        integer not null default 0,
  -- Les 5 rubriques de prose, en markdown :
  situation    text,
  ambiance     text,
  qui_y_vit    text,
  lieux_cles   text,
  accroche_rp  text,
  cree_le      timestamptz not null default now(),
  modifie_le   timestamptz not null default now(),
  unique (univers_id, slug)
);


-- ============================================================
--  3) PNJ — les habitants joués par le MJ
-- ------------------------------------------------------------
--  Créé AVANT `lieux`, car un lieu pointe vers son PNJ-pilier
--  (pnj_pilier_id) : la table référencée doit exister d'abord.
--
--  CHOIX (`age` en integer) : l'âge est une donnée structurée. Si
--  un perso a un âge « flou » (« la cinquantaine »), ça se dit très
--  bien dans `caractere`/`origine` ; on garde la colonne numérique
--  propre et nullable.
-- ============================================================
create table if not exists public.pnj (
  id               uuid primary key default gen_random_uuid(),
  univers_id       uuid not null references public.univers (id) on delete cascade,
  slug             text not null,
  prenom           text not null,
  nom              text,
  surnom           text,
  role_court       text,                   -- ex : « le roi du pain américain »
  age              integer,
  -- Prose, en markdown :
  origine          text,
  role_metier      text,
  caractere        text,
  voix_parler      text,                   -- la « voix / parler » (clé pour le MJ)
  accroches_rp     text,
  couleur          text,                   -- hex
  avatar_initiale  text,                   -- ex : « M » pour Magloire
  statut           text not null default 'figurant'
                     check (statut in ('pilier', 'figurant')),
  ordre            integer not null default 0,
  cree_le          timestamptz not null default now(),
  modifie_le       timestamptz not null default now(),
  unique (univers_id, slug)
);


-- ============================================================
--  4) LIEUX — les décors où l'on se croise
-- ------------------------------------------------------------
--  CHOIX (FK nullable + on delete set null) :
--   • quartier_id nullable → un lieu peut ne dépendre d'aucun
--     quartier (ex : un lieu « hors les murs »). Si le quartier
--     est supprimé, le lieu survit (quartier_id repasse à NULL).
--   • pnj_pilier_id nullable → tout lieu n'a pas forcément un
--     pilier. Si le PNJ est supprimé, le lieu reste (lien à NULL).
-- ============================================================
create table if not exists public.lieux (
  id             uuid primary key default gen_random_uuid(),
  univers_id     uuid not null references public.univers (id) on delete cascade,
  quartier_id    uuid references public.quartiers (id) on delete set null,
  slug           text not null,
  nom            text not null,
  sous_titre     text,
  emoji          text,
  couleur        text,                     -- hex
  ordre          integer not null default 0,
  description    text,                     -- markdown
  accroche_rp    text,                     -- markdown
  pnj_pilier_id  uuid references public.pnj (id) on delete set null,
  cree_le        timestamptz not null default now(),
  modifie_le     timestamptz not null default now(),
  unique (univers_id, slug)
);


-- ============================================================
--  5) ESCAPADES — le Sud accessible (hors la ville)
-- ============================================================
create table if not exists public.escapades (
  id                  uuid primary key default gen_random_uuid(),
  univers_id          uuid not null references public.univers (id) on delete cascade,
  slug                text not null,
  nom                 text not null,
  sous_titre          text,
  emoji               text,
  couleur             text,                -- hex
  ordre               integer not null default 0,
  duree_depuis_ville  text,                -- ex : « ~15 min »
  description         text,                -- markdown
  accroche_rp         text,                -- markdown
  cree_le             timestamptz not null default now(),
  modifie_le          timestamptz not null default now(),
  unique (univers_id, slug)
);


-- ============================================================
--  6) BLOCS_CULTURE — la vie quotidienne & la culture
-- ============================================================
create table if not exists public.blocs_culture (
  id          uuid primary key default gen_random_uuid(),
  univers_id  uuid not null references public.univers (id) on delete cascade,
  slug        text not null,
  titre       text not null,
  emoji       text,
  couleur     text,                        -- hex
  ordre       integer not null default 0,
  contenu     text,                        -- markdown
  cree_le     timestamptz not null default now(),
  modifie_le  timestamptz not null default now(),
  unique (univers_id, slug)
);


-- ============================================================
--  7) LEXIQUE — le créole (générique : rattaché à un bloc_culture)
-- ------------------------------------------------------------
--  CHOIX : table générique `lexique` plutôt que `lexique_creole`.
--  Elle est rattachée à un bloc de culture (FK), donc n'importe
--  quel bloc (créole, cuisine, métiers…) peut porter son petit
--  glossaire mot ↔ traduction. Plus souple qu'un nom figé.
-- ============================================================
create table if not exists public.lexique (
  id               uuid primary key default gen_random_uuid(),
  bloc_culture_id  uuid not null references public.blocs_culture (id) on delete cascade,
  mot              text not null,
  traduction       text,
  ordre            integer not null default 0,
  cree_le          timestamptz not null default now(),
  modifie_le       timestamptz not null default now()
);


-- ============================================================
--  8) MOIS_CALENDRIER — les 12 mois de l'île
-- ------------------------------------------------------------
--  `importance` 0–2 = le nombre d'étoiles ★ d'un événement.
--  Contrainte unique (univers_id, mois_numero) : un seul mois 7
--  par univers.
-- ============================================================
create table if not exists public.mois_calendrier (
  id            uuid primary key default gen_random_uuid(),
  univers_id    uuid not null references public.univers (id) on delete cascade,
  mois_numero   integer not null check (mois_numero between 1 and 12),
  mois_nom      text,                       -- ex : « Jan »
  saison        text check (saison in ('chaud', 'frais', 'transition')),
  evenement     text,                       -- court, ex : « Nouvel An tamoul »
  importance    integer not null default 0 check (importance between 0 and 2),
  meteo_resume  text,                       -- markdown
  ordre         integer not null default 0,
  cree_le       timestamptz not null default now(),
  modifie_le    timestamptz not null default now(),
  unique (univers_id, mois_numero)
);


-- ============================================================
--  9) CHAPITRE_CALENDRIER_FOCUS — les 2 focus du Ch.V
--     (le 20 Désanm, la saison cyclonique)
-- ============================================================
create table if not exists public.chapitre_calendrier_focus (
  id          uuid primary key default gen_random_uuid(),
  univers_id  uuid not null references public.univers (id) on delete cascade,
  slug        text not null,
  titre       text not null,
  emoji       text,
  couleur     text,                        -- hex
  contenu     text,                        -- markdown
  ordre       integer not null default 0,
  cree_le     timestamptz not null default now(),
  modifie_le  timestamptz not null default now(),
  unique (univers_id, slug)
);


-- ============================================================
--  10) TRIGGERS `modifie_le` — un par table horodatée
-- ------------------------------------------------------------
--  On (re)pose chaque trigger proprement : `drop … if exists`
--  d'abord (create trigger ne sait pas faire « if not exists »),
--  pour rester idempotent. La table `lexique` a un `modifie_le`
--  aussi, on l'inclut.
-- ============================================================
drop trigger if exists trg_modifie_le on public.univers;
create trigger trg_modifie_le before update on public.univers
  for each row execute procedure public.touch_modifie_le();

drop trigger if exists trg_modifie_le on public.quartiers;
create trigger trg_modifie_le before update on public.quartiers
  for each row execute procedure public.touch_modifie_le();

drop trigger if exists trg_modifie_le on public.pnj;
create trigger trg_modifie_le before update on public.pnj
  for each row execute procedure public.touch_modifie_le();

drop trigger if exists trg_modifie_le on public.lieux;
create trigger trg_modifie_le before update on public.lieux
  for each row execute procedure public.touch_modifie_le();

drop trigger if exists trg_modifie_le on public.escapades;
create trigger trg_modifie_le before update on public.escapades
  for each row execute procedure public.touch_modifie_le();

drop trigger if exists trg_modifie_le on public.blocs_culture;
create trigger trg_modifie_le before update on public.blocs_culture
  for each row execute procedure public.touch_modifie_le();

drop trigger if exists trg_modifie_le on public.lexique;
create trigger trg_modifie_le before update on public.lexique
  for each row execute procedure public.touch_modifie_le();

drop trigger if exists trg_modifie_le on public.mois_calendrier;
create trigger trg_modifie_le before update on public.mois_calendrier
  for each row execute procedure public.touch_modifie_le();

drop trigger if exists trg_modifie_le on public.chapitre_calendrier_focus;
create trigger trg_modifie_le before update on public.chapitre_calendrier_focus
  for each row execute procedure public.touch_modifie_le();


-- ============================================================
--  11) RLS — on ferme tout, puis on ouvre au cas par cas
-- ------------------------------------------------------------
--  Pour CHAQUE table de lore, le même duo de policies :
--   • SELECT  → autorisé à tout utilisateur `authenticated`
--               (using true : n'importe quel membre connecté lit).
--   • ALL     → réservé à l'admin (is_admin()), ce qui couvre
--               INSERT / UPDATE / DELETE en un seul policy.
--
--  Rappel : les policies « permissives » se cumulent en OU. Pour un
--  SELECT, la policy de lecture suffit ; pour une écriture, seule la
--  policy admin s'applique → un membre lit mais n'écrit pas.
--
--  On `drop policy if exists` avant chaque `create` pour rester
--  idempotent (Postgres ne gère pas « create policy if not exists »).
-- ============================================================

-- ---- univers ----
alter table public.univers enable row level security;
drop policy if exists "Lire les univers" on public.univers;
create policy "Lire les univers"
  on public.univers for select to authenticated using ( true );
drop policy if exists "Admin gère les univers" on public.univers;
create policy "Admin gère les univers"
  on public.univers for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---- quartiers ----
alter table public.quartiers enable row level security;
drop policy if exists "Lire les quartiers" on public.quartiers;
create policy "Lire les quartiers"
  on public.quartiers for select to authenticated using ( true );
drop policy if exists "Admin gère les quartiers" on public.quartiers;
create policy "Admin gère les quartiers"
  on public.quartiers for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---- pnj ----
alter table public.pnj enable row level security;
drop policy if exists "Lire les pnj" on public.pnj;
create policy "Lire les pnj"
  on public.pnj for select to authenticated using ( true );
drop policy if exists "Admin gère les pnj" on public.pnj;
create policy "Admin gère les pnj"
  on public.pnj for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---- lieux ----
alter table public.lieux enable row level security;
drop policy if exists "Lire les lieux" on public.lieux;
create policy "Lire les lieux"
  on public.lieux for select to authenticated using ( true );
drop policy if exists "Admin gère les lieux" on public.lieux;
create policy "Admin gère les lieux"
  on public.lieux for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---- escapades ----
alter table public.escapades enable row level security;
drop policy if exists "Lire les escapades" on public.escapades;
create policy "Lire les escapades"
  on public.escapades for select to authenticated using ( true );
drop policy if exists "Admin gère les escapades" on public.escapades;
create policy "Admin gère les escapades"
  on public.escapades for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---- blocs_culture ----
alter table public.blocs_culture enable row level security;
drop policy if exists "Lire la culture" on public.blocs_culture;
create policy "Lire la culture"
  on public.blocs_culture for select to authenticated using ( true );
drop policy if exists "Admin gère la culture" on public.blocs_culture;
create policy "Admin gère la culture"
  on public.blocs_culture for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---- lexique ----
alter table public.lexique enable row level security;
drop policy if exists "Lire le lexique" on public.lexique;
create policy "Lire le lexique"
  on public.lexique for select to authenticated using ( true );
drop policy if exists "Admin gère le lexique" on public.lexique;
create policy "Admin gère le lexique"
  on public.lexique for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---- mois_calendrier ----
alter table public.mois_calendrier enable row level security;
drop policy if exists "Lire le calendrier" on public.mois_calendrier;
create policy "Lire le calendrier"
  on public.mois_calendrier for select to authenticated using ( true );
drop policy if exists "Admin gère le calendrier" on public.mois_calendrier;
create policy "Admin gère le calendrier"
  on public.mois_calendrier for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );

-- ---- chapitre_calendrier_focus ----
alter table public.chapitre_calendrier_focus enable row level security;
drop policy if exists "Lire les focus calendrier" on public.chapitre_calendrier_focus;
create policy "Lire les focus calendrier"
  on public.chapitre_calendrier_focus for select to authenticated using ( true );
drop policy if exists "Admin gère les focus calendrier" on public.chapitre_calendrier_focus;
create policy "Admin gère les focus calendrier"
  on public.chapitre_calendrier_focus for all to authenticated
  using ( public.is_admin() ) with check ( public.is_admin() );


-- ============================================================
--  12) SEED (données) — l'univers Saint-Pierre 974, et lui seul
-- ------------------------------------------------------------
--  Transcrit depuis docs/legendia-univers-saintpierre.html :
--   • description_courte → la « tagline » de la couverture ;
--   • description_longue → les 3 paragraphes de la carte d'intro,
--     <b>…</b> convertis en **gras** markdown ;
--   • fiche_identite     → les 6 « fact chips » de la fiche, en JSON.
--  Aucun quartier / lieu / PNJ ici : le contenu créatif du
--  Centre-ville viendra dans un SQL séparé, une fois rédigé.
--
--  `on conflict (slug) do nothing` : rejouable sans doublon. (Pour
--  METTRE À JOUR un univers déjà présent, on fera un UPDATE dédié ;
--  ce seed ne sert qu'à la création initiale.)
-- ============================================================
insert into public.univers
  (slug, nom, sous_titre, description_courte, description_longue,
   statut, couleur_principale, fiche_identite, ordre)
values (
  'saint-pierre-974',
  'Saint-Pierre 974',
  'La capitale du Sud · île de La Réunion',
  -- description_courte (tagline)
  'Une vraie ville, une vraie île, le quotidien sous les tropiques. Ici, on vit, on s''aime, on se chamaille — au rythme du lagon et des alizés.',
  -- description_longue (intro, en markdown)
  'Bienvenue à **Saint-Pierre**, « capitale » du Sud réunionnais — une vraie ville de 84 000 habitants, balnéaire, festive, métissée. *(ville réelle, restituée fidèlement)*

Ici, le décor existe pour de vrai : le **front de mer** et son lagon, le **marché forain du samedi** (l''un des plus beaux de France), le vieux quartier de pêcheurs de **Terre-Sainte** et ses ruelles, le port de plaisance, les temples tamouls, la rue commerçante des Bons Enfants. Les joueurs reconnaissent les lieux, s''y projettent tout de suite — zéro worldbuilding à apprendre.

Ce qu''on invente, ce sont les **habitants et leurs histoires**. Le quotidien ordinaire : un boulot, des amours, des amitiés, des voisins. Le slice of life pur, porté par une île qui a du caractère — chaleur, créole, cyclones, fêtes, et le Sud sauvage à portée de route.',
  'preview',
  '#1fb6ad',
  '[
    {"emoji":"🏝️","cle":"Lieu","valeur":"Saint-Pierre","detail":"Sud de La Réunion (974)"},
    {"emoji":"👥","cle":"Population","valeur":"~84 000","detail":"3ᵉ ville de l''île"},
    {"emoji":"🌡️","cle":"Climat","valeur":"Tropical","detail":"tempéré dans les Hauts"},
    {"emoji":"🗓️","cle":"Saisons","valeur":"Inversées","detail":"été austral : déc.–mars"},
    {"emoji":"🌀","cle":"Aléa","valeur":"Cyclones","detail":"l''été, la vie se suspend"},
    {"emoji":"🎶","cle":"Vibe","valeur":"Festive","detail":"Sakifo, marché, front de mer"}
  ]'::jsonb,
  1
)
on conflict (slug) do nothing;


-- ============================================================
--  13) Vérifications (lecture seule — à décommenter au besoin)
-- ------------------------------------------------------------
-- select slug, nom, statut, jsonb_array_length(fiche_identite) as nb_chips
-- from public.univers;
--
-- -- Les policies posées, table par table :
-- select tablename, policyname, cmd
-- from pg_policies
-- where schemaname = 'public'
-- order by tablename, policyname;
-- ============================================================
