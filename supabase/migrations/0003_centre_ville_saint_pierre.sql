-- ============================================================
--  Migration 0003 — Le Centre-ville de Saint-Pierre (quartier témoin)
-- ------------------------------------------------------------
--  On migre le PREMIER quartier complet : le Centre-ville, avec
--  ses 3 lieux (Chez Picard, le pub de Dimitri, le marché couvert)
--  et ses 2 PNJ-piliers (Lila Picard, Dimitri Lebon). C'est le
--  « témoin » qui valide le rendu visuel avant de migrer le reste.
--
--  Deux temps :
--   1) On ÉTEND le schéma de la 0002 avec 3 colonnes que le
--      contenu réclame et qui n'existaient pas encore :
--        • quartiers.etiquette   (un label poétique : « le cœur »)
--        • lieux.etiquette        (idem : « le repère quotidien »…)
--        • pnj.signes_distinctifs (la description physique, markdown)
--        • pnj.avatar_url         (vide pour l'instant : les
--          faceclaims se brancheront en Phase III avec le Storage)
--   2) On INSÈRE le contenu (quartier, PNJ, lieux), prose en
--      Markdown, FK résolues par sous-requêtes sur les slugs.
--
--  Idempotente : ADD COLUMN IF NOT EXISTS + insertions en
--  `on conflict (univers_id, slug) do nothing`. Rejouable.
--
--  ⚠️ À exécuter dans l'éditeur SQL Supabase APRÈS validation.
--     Pré-requis : la 0002 doit être passée (univers Saint-Pierre
--     présent). On enveloppe le tout dans une transaction : soit
--     tout passe, soit rien.
-- ============================================================

begin;

-- ============================================================
--  1) Extension du schéma (3 nouvelles colonnes)
-- ------------------------------------------------------------
--  Pourquoi `etiquette` EN PLUS de `sous_titre` ? Les deux jouent
--  des rôles différents : `sous_titre` décrit la NATURE du lieu
--  (« café-terrasse · journée »), `etiquette` donne son RÔLE
--  narratif d'un mot (« le repère quotidien »). Repris du style
--  « pastille » de la bible HTML.
-- ============================================================
alter table public.quartiers add column if not exists etiquette text;
alter table public.lieux     add column if not exists etiquette text;
alter table public.pnj       add column if not exists signes_distinctifs text; -- markdown
alter table public.pnj       add column if not exists avatar_url text;          -- vide pour l'instant


-- ============================================================
--  2) LE QUARTIER — Centre-ville
-- ------------------------------------------------------------
--  univers_id résolu par sous-requête sur le slug de l'univers.
-- ============================================================
insert into public.quartiers
  (univers_id, slug, nom, sous_titre, emoji, couleur, ordre, etiquette,
   situation, ambiance, qui_y_vit, lieux_cles, accroche_rp)
select
  u.id,
  'centre-ville',
  'Le Centre-ville',
  'cœur urbain · littoral',
  '🏛️',
  '#ff6f54',
  1,
  'le cœur',
  -- situation
  $md$Quadrillé en damier (plan hippodamien), **borné à l'est par la rivière d'Abord**. Un fort dénivelé entre le front de mer et les hauts lui vaut son surnom de **« petit San Francisco »** — vue plongeante sur l'océan quand on arrive par le haut.$md$,
  -- ambiance
  $md$Le Centre-ville **bosse la journée et sort le soir**, dans une continuité douce qui ne s'arrête jamais vraiment. Les commerces ouvrent à 8h, les terrasses se remplissent à midi, les pubs s'éveillent au crépuscule, et le tout bruisse jusque tard. La **rue des Bons Enfants** est l'artère piétonne qui structure tout — on y croise tout le monde, à tour de rôle, selon l'heure. *Si la ville a un pouls, il bat ici.*$md$,
  -- qui_y_vit
  $md$Tout le monde, sans exception. Commerçants installés, jeunes actifs, étudiants en colocation, retraités du matin qui prennent leur café, noctambules qui rentrent à l'aube. Le **mélange métissé** est à son plus visible ici — toutes les communautés de l'île se côtoient dans le même quartier, sans frontières.$md$,
  -- lieux_cles
  $md$L'hôtel de ville, l'entrepôt Kerveguen, la maison Orré, le **marché couvert**, les temples tamouls, les églises, la mosquée au haut minaret, et bien sûr **Chez Picard** (le café de Lila) et **le pub de Dimitri** rue des Bons Enfants.$md$,
  -- accroche_rp
  $md$Le terrain de jeu central par excellence : rencontres de terrasse, courses du quotidien, sorties du soir, colocations étudiantes, premières fois et habitudes de toujours. Si un joueur ne sait pas où poser sa première scène, le Centre-ville est *la bonne réponse* : on s'y retrouve toujours, sans avoir à se chercher.$md$
from public.univers u
where u.slug = 'saint-pierre-974'
on conflict (univers_id, slug) do nothing;


-- ============================================================
--  3) LES PNJ-PILIERS (créés avant les lieux qui les référencent)
-- ============================================================

-- ---- PNJ 1 : Lila Picard ----
insert into public.pnj
  (univers_id, slug, prenom, nom, surnom, role_court, age, couleur,
   avatar_initiale, avatar_url, statut, ordre,
   origine, role_metier, caractere, voix_parler, accroches_rp, signes_distinctifs)
select
  u.id,
  'lila-picard',
  'Lila',
  'Picard',
  null,
  'la patronne du café qui a tout gagné toute seule',
  30,
  '#d97706',
  'LP',
  '',
  'pilier',
  1,
  -- origine
  $md$Née à **Bois d'Olives** dans les Hauts. Mère caissière, père absent. Métisse créole-zarab, de souche réunionnaise par sa mère et tunisienne par un grand-père maternel.$md$,
  -- role_metier
  $md$Patronne et propriétaire de **Chez Picard**, café-terrasse de la rue des Bons Enfants. **Ancienne serveuse de l'établissement** (qui s'appelait alors *Le Tilleul*), elle l'a racheté à son ancien patron il y a quatre ans, à un prix amical, payable sur dix ans. Elle rembourse encore.$md$,
  -- caractere
  $md$Discrète, attentive, **très observatrice**. Pas la patronne expansive — l'inverse : elle te regarde, elle te jauge, elle te sert ton café exactement comme tu l'aimes la deuxième fois. Dit peu, sait beaucoup. *Sous la douceur, une volonté de fer* — elle a tout perdu et tout reconquis, et quand quelqu'un essaie de la rouler dans son café, elle pose une main calme sur le comptoir et dit, voix basse : *« Pas chez moi. »* Ça suffit.$md$,
  -- voix_parler
  $md$Français créolisé fluide, sans excès d'argot. Voix calme, posée, **toujours plus basse que celle de son interlocuteur**. Phrases courtes. Quelques expressions péi sincères (« mi koné », « lé bon ») mais sans rouler exprès dans le créole. Rit peu, sourit en coin.$md$,
  -- accroches_rp
  $md$- Le repère quotidien des habitants → croiser Lila, c'est croiser le Centre-ville
- Une figure de confiance silencieuse pour qui veut se confier sans être jugé
- Un témoin du quartier — elle voit tout passer, elle peut renseigner discrètement
- Sa galère financière (le prêt à rembourser) → ouverture pour des persos qui pourraient l'aider, ou simplement la voir reconnaître qu'elle est fatiguée
- Sa **branche de tilleul** tatouée sur l'avant-bras → curiosité pour qui la remarque$md$,
  -- signes_distinctifs
  $md$Cheveux longs noirs, souvent attachés en chignon désordonné avec une pince. Tatouage discret d'une branche de tilleul sur l'avant-bras gauche. Tablier impeccablement propre. Type métisse créole/maghrébine, regard intense, beauté discrète et pas glamour.$md$
from public.univers u
where u.slug = 'saint-pierre-974'
on conflict (univers_id, slug) do nothing;

-- ---- PNJ 2 : Dimitri Lebon ----
insert into public.pnj
  (univers_id, slug, prenom, nom, surnom, role_court, age, couleur,
   avatar_initiale, avatar_url, statut, ordre,
   origine, role_metier, caractere, voix_parler, accroches_rp, signes_distinctifs)
select
  u.id,
  'dimitri-lebon',
  'Dimitri',
  'Lebon',
  null,
  'le barman des nocturnes, presque local après dix ans',
  34,
  '#5b53d6',
  'DL',
  '',
  'pilier',
  2,
  -- origine
  $md$Métropolitain, originaire de la région lyonnaise. **Arrivé à Saint-Pierre à 25 ans « pour six mois », jamais reparti.** Désormais plus saint-pierrois que beaucoup d'enfants du pays.$md$,
  -- role_metier
  $md$Patron et barman du **Comptoir de Dimitri** (dit simplement « chez Dimitri »), pub d'angle de la rue des Bons Enfants. A racheté l'affaire à 30 ans, après cinq ans à y travailler comme barman pour le précédent propriétaire.$md$,
  -- caractere
  $md$Posé, observateur, **confident malgré lui**. Mémoire des visages et des cœurs brisés. Sait quand servir et quand écouter. *Ne juge jamais.* Pince-sans-rire en surface, une vraie tendresse en dessous. Joue parfois du piano quand il ne reste que les habitués, jamais en représentation, juste pour lui.$md$,
  -- voix_parler
  $md$Français hexagonal teinté d'expressions péi adoptées au fil des années — il dit « lé bon » par habitude, mais il garde son accent. Ton calme, réplique qui fait mouche, humour sec. Voix grave, parle peu fort.$md$,
  -- accroches_rp
  $md$- Le confessionnal du soir → on vient chez lui pour les confidences qu'on ne ferait nulle part ailleurs
- Le point de chute des soirées qui s'éternisent
- Regard d'un « presque local » sur la ville — il peut éclairer un nouveau venu sur les codes de l'île sans paternalisme
- Sa propre histoire d'adoption par Saint-Pierre → pour les persos qui doutent, qui hésitent à rester, qui se demandent si on peut « devenir d'ici »
- Le piano dans le coin → curiosité pour qui le remarque (et que peut-être il joue, parfois, très tard)$md$,
  -- signes_distinctifs
  $md$La trentaine bien tassée, type européen, cheveux châtain foncé portés en bataille douce. Légère barbe de quelques jours. Toujours en chemise sombre manches retroussées, un torchon sur l'épaule. Beauté discrète, regard attentif, un sourire qui ne s'étale pas.$md$
from public.univers u
where u.slug = 'saint-pierre-974'
on conflict (univers_id, slug) do nothing;


-- ============================================================
--  4) LES LIEUX (FK quartier + FK pilier résolues par sous-requête)
-- ------------------------------------------------------------
--  Chaque lieu pointe vers le quartier 'centre-ville' et (sauf le
--  marché) vers son PNJ-pilier. Les sous-requêtes sont bornées au
--  même univers (u.id) pour ne jamais attraper l'homonyme d'un
--  autre univers à l'avenir.
-- ============================================================

-- ---- LIEU 1 : Chez Picard (pilier : Lila) ----
insert into public.lieux
  (univers_id, quartier_id, slug, nom, sous_titre, emoji, couleur, ordre,
   etiquette, description, accroche_rp, pnj_pilier_id)
select
  u.id,
  (select q.id from public.quartiers q where q.univers_id = u.id and q.slug = 'centre-ville'),
  'chez-picard',
  'Chez Picard',
  'café-terrasse · journée',
  '☕',
  '#d97706',
  1,
  'le repère quotidien',
  -- description
  $md$Un café-terrasse de la **rue des Bons Enfants**, en plein cœur de la rue piétonne. Devanture simple, sept tables en terrasse, six au comptoir, des plantes vertes posées sans façon, et une **enseigne sobre où on lit *Chez Picard*** en lettres bleu marine. Ouvre à 6h, ferme à 18h, six jours sur sept. Café correct, viennoiseries du boulanger d'à côté, sandwichs maison à midi, et — petit luxe — un jus pressé minute pour qui le demande.

C'est **le repère quotidien du Centre-ville**. Les actifs s'y arrêtent avant le bureau, les habitués y prennent leur café à la même heure depuis des années, les étudiants y traînent l'après-midi avec un livre. Lila les connaît tous, même ceux qui ne lui parlent jamais.$md$,
  -- accroche_rp
  $md$Le point de chute du matin et de la journée. **Pour les scènes de quotidien doux** : se croiser à la terrasse, retrouver un ami pour un café, traîner seul avec un livre. *« Comme d'habitude ? »* est l'ouverture la plus simple et la plus fréquente — et Lila la lance dès la deuxième visite.$md$,
  (select p.id from public.pnj p where p.univers_id = u.id and p.slug = 'lila-picard')
from public.univers u
where u.slug = 'saint-pierre-974'
on conflict (univers_id, slug) do nothing;

-- ---- LIEU 2 : Le pub de Dimitri (pilier : Dimitri) ----
insert into public.lieux
  (univers_id, quartier_id, slug, nom, sous_titre, emoji, couleur, ordre,
   etiquette, description, accroche_rp, pnj_pilier_id)
select
  u.id,
  (select q.id from public.quartiers q where q.univers_id = u.id and q.slug = 'centre-ville'),
  'pub-de-dimitri',
  'Le pub de Dimitri',
  'bar / pub · soir et nuit',
  '🌃',
  '#5b53d6',
  2,
  'le confessionnal du soir',
  -- description
  $md$À l'angle de la rue des Bons Enfants et d'une perpendiculaire qui descend vers le port. Façade en bois sombre, vitres ambrées, néon discret. **Pas de nom flashy** — juste *Le Comptoir de Dimitri* en lettres sobres, et tout le monde dit « chez Dimitri ». Ouvre à 17h, ferme tard. Bières pression correctes, vins au verre, cocktails simples mais bien faits, et un piano droit dans le coin que personne ne joue à part Dimitri, parfois, quand il n'y a plus que les habitués.

L'ambiance change selon l'heure. **En début de soirée**, les afterworks bruyants, les retrouvailles, les rires forts. **Plus tard**, ça se feutre — les groupes se dispersent, les couples s'isolent dans les box, et au comptoir, il reste *ceux qui parlent à Dimitri*. C'est là que la magie opère : **on vient chez lui le soir pour dire des choses qu'on ne dirait nulle part ailleurs.**$md$,
  -- accroche_rp
  $md$Le confessionnal silencieux du Centre-ville. Pour les confidences, les chagrins d'amour, les conversations qui s'étirent jusqu'à 2h du matin. Aussi pour les *premières fois* — premier rendez-vous, première soirée entre amis, première fois qu'on parle d'un sujet difficile. **Dimitri ne juge pas, ne raconte rien, et se souvient de tout.**$md$,
  (select p.id from public.pnj p where p.univers_id = u.id and p.slug = 'dimitri-lebon')
from public.univers u
where u.slug = 'saint-pierre-974'
on conflict (univers_id, slug) do nothing;

-- ---- LIEU 3 : Le marché couvert (AUCUN pilier — voulu : lieu collectif) ----
insert into public.lieux
  (univers_id, quartier_id, slug, nom, sous_titre, emoji, couleur, ordre,
   etiquette, description, accroche_rp, pnj_pilier_id)
select
  u.id,
  (select q.id from public.quartiers q where q.univers_id = u.id and q.slug = 'centre-ville'),
  'marche-couvert',
  'Le marché couvert',
  'marché · journée',
  '🍅',
  '#6cbf5b',
  3,
  'le brouhaha vivant',
  -- description
  $md$Une grande **halle couverte au cœur du Centre-ville**, ouverte du mardi au dimanche, de 6h à 13h. Une trentaine d'étals serrés sous une charpente métallique : poissonniers le matin, primeurs, fromager, boucher, deux marchands de fleurs, un torréfacteur, des étals d'épices et de vanille, et plusieurs vendeurs de samoussas, bouchons, achards pour la pause de midi.

Bruyant, coloré, métissé. **Tout le monde y vient au moins une fois par semaine.** L'ambiance change selon l'heure : effervescente le matin, presque calme à la fermeture quand les marchands plient et qu'il ne reste que les derniers cartons à embarquer.$md$,
  -- accroche_rp
  $md$Lieu **collectif et anonyme** par excellence. Pour les scènes où l'on se croise au hasard, où l'on entend ce qu'on n'aurait pas dû entendre, où l'on file un coup de main à une vieille dame qui peine avec son cabas. Le MJ y improvise les figurants selon les besoins de la scène : la marchande de fleurs bavarde, le poissonnier laconique, l'enfant qui pleure parce qu'il a perdu sa maman. **Aucun pilier — c'est l'ambiance qui tient le lieu.**$md$,
  null  -- pnj_pilier_id volontairement vide
from public.univers u
where u.slug = 'saint-pierre-974'
on conflict (univers_id, slug) do nothing;


commit;


-- ============================================================
--  5) Vérifications (lecture seule — à décommenter au besoin)
-- ------------------------------------------------------------
-- -- Le quartier et ses lieux, avec le pilier de chacun :
-- select l.ordre, l.nom as lieu, l.etiquette,
--        coalesce(p.prenom || ' ' || p.nom, '— aucun —') as pilier
-- from public.lieux l
-- join public.quartiers q on q.id = l.quartier_id and q.slug = 'centre-ville'
-- left join public.pnj p on p.id = l.pnj_pilier_id
-- order by l.ordre;
-- ============================================================
