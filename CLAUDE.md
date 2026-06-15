# CLAUDE.md — Legendia

> Fichier de cadrage lu par Claude Code à chaque session. Il décrit **ce qu'on construit**, **comment**, et **les règles à respecter**. À garder à jour quand le projet évolue.
>
> ⚠️ **Le concept a entièrement changé.** Tout ancien contenu lié à « Grimm / Savannah / les Deep / un registre sombre » est **obsolète** et doit être retiré, pas réutilisé. Le projet actuel est décrit ci-dessous.

---

## 1 · Le projet en une phrase

**Legendia, la cité des légendes.** Un jeu de rôle narratif (slice of life fantasy) où l'on vient *vivre une autre vie* dans une cité somptueuse et magique, portée par une IA qui fait grouiller le monde de PNJ qui se souviennent de vous et d'événements qui surgissent sans cesse.

Tagline : **« Venez vivre une autre vie. »**

Deux briques :
1. **Le site** (priorité actuelle) — la vitrine immersive de la cité. Next.js + Supabase, déployé sur Vercel.
2. **Le bot Discord** (plus tard) — le cœur du projet : un MJ IA (API Claude) qui incarne les PNJ (avec mémoire) et anime la cité. **À ne pas commencer tant que le site n'est pas posé.**

---

## 2 · Le cœur du concept (à ne jamais perdre de vue)

**Legendia = le quotidien rendu inépuisable par l'IA.** Ce n'est pas un thème, c'est une expérience. Trois couches :
1. **Les joueurs entre eux** — le cœur émotionnel (relations, scènes). L'IA ne remplace jamais le RP joueur-à-joueur.
2. **Les PNJ-IA qui se souviennent** — le liant chaleureux : ils connaissent le perso, son quartier, ses habitudes ; la cité te reconnaît.
3. **Les événements injectés par l'IA** — l'anti-routine : il se passe toujours quelque chose. C'est la promesse même (« vivre plus intensément »).

Le décor (la cité) est un **écrin** au service de ce cœur.

---

## 3 · Règles de collaboration (importantes)

- **Toujours montrer un plan avant d'agir** sur une tâche non triviale. Pas de refactor massif ou de suppression sans validation.
- **Avancer par petits incréments validables.**
- **Ne jamais toucher aux fichiers d'infra sans demander** : `.env*`, config Vercel, clés Supabase.
- **Ne jamais commiter de secret.** Les `.env*` restent gitignorés.
- **Demander avant d'introduire une nouvelle dépendance lourde.**
- Le code et les commentaires peuvent être en français (projet francophone).

---

## 4 · État du repo & ordre de construction

Le site contient (peut-être encore) une ancienne homepage et des pages dans l'ancienne DA « registre sombre ». **Cette DA est abandonnée.** Il faut refaire la homepage et les pages dans la nouvelle DA (voir §6).

**Phase 1 — refonte du site**
1. Vérifier/poser les tokens de la nouvelle DA en variables CSS.
2. Refaire la **homepage** dans la nouvelle DA (maquette validée, voir §7).
3. Réaligner les pages-talons sur le nouveau monde (quartiers, etc.).

**Phase 2 — le bot Discord** (chantier séparé, plus tard) : PNJ à mémoire + moteur d'événements (API Claude).

---

## 5 · Stack technique

- **Framework** : Next.js (App Router), TypeScript
- **Style** : Tailwind CSS v4 (thème en CSS `@theme`), tokens DA en variables CSS
- **Données** : Supabase (Postgres), schéma `public` vide (reset effectué)
- **Déploiement** : Vercel (déjà connecté)
- **Polices** : Playfair Display (titres) · Tangerine (tagline calligraphiée) · Cinzel (petites capitales) · Lora (corps) — Google Fonts
- Variables d'env documentées dans `.env.example`

---

## 6 · Direction artistique (NON négociable)

**Esprit :** féerique mais épuré et premium. Beaucoup d'espace négatif. Le merveilleux est *suggéré* (lanterne, étoile, lueurs), jamais surchargé. Loin du grimoire sombre comme du baroque illustratif. Une nuit enchantée, somptueuse et accueillante.

**Palette (variables CSS) :**
```
--night:    #150a33   /* fond, nuit pourpre profond */
--night2:   #231150
--plum:     #3a1d6e
--purple:   #6b3fa0
--gold:     #e9c46a   /* or champagne, principal */
--gold-hi:  #ffe9a8   /* reflet or */
--gold-lo:  #b07f2c   /* or sombre */
--emerald:  #3fc9a3   /* accent joyau, ponctuel */
--rose:     #df7ab0   /* accent joyau, ponctuel */
--cream:    #f6ecd6   /* texte sur fond sombre */
--soft:     #dcc8ec   /* texte secondaire (lavande) */
--dim:      #a890c4
```
L'or et le pourpre **dominent** ; l'émeraude et le rose **ponctuent** (gemmes, lueurs, étoiles, accents de survol). Jamais d'envahissement.

**Typographie :**
- Titres : **Playfair Display** (serif élégant, baroque maîtrisé)
- Tagline / accents calligraphiés : **Tangerine** (script fin, féerique), en or
- Petites capitales / labels : **Cinzel**, letter-spacing large
- Corps : **Lora** (serif chaleureux et lisible)

**Signatures visuelles :**
- **L'emblème** : une lanterne en trait fin doré dont la lumière est une étoile — « la cité qui ne dort jamais ». Logo officiel.
- **L'or à la feuille** sur les titres (dégradé `--gold-lo → --gold → --gold-hi → --gold`), avec reflet qui balaie lentement.
- **Le ciel nocturne** : fond pourpre dégradé, étoiles qui scintillent, **lanternes dorées qui dérivent** lentement (certaines teintées rose/émeraude). Respecter `prefers-reduced-motion`.
- **La cité à l'horizon** : silhouette baroque (coupoles, tours, ponts) en ombre dorée, avec reflet dans les canaux.
- **Cadre baroque fin** (filets dorés, coins ouvragés, petit fleuron) pour encadrer sans charger.

**Qualité de base :** responsive jusqu'au mobile, focus clavier visible, motion réduite respectée.

---

## 7 · La homepage (maquette validée)

Une page qui se parcourt en descendant, dans l'ambiance nuit enchantée :

1. **Hero** plein écran — ciel pourpre, étoiles, lanternes dérivantes (or/rose/émeraude), halo de lune. Cadre baroque fin. Eyebrow « La cité des légendes » (Cinzel). Titre **Legendia** en or à la feuille (Playfair) avec reflet. Tagline **« Venez vivre une autre vie »** en calligraphie dorée (Tangerine). Sous-titre. Bouton « Poussez les portes ». Indice de défilement. Silhouette de la cité + reflet en bas.
2. **Invitation** — court texte d'accroche chaleureux en italique (la cité qui ne dort jamais, on y habite, autrement).
3. **« Ce qui rend Legendia vivante »** — 3 cartes (le cœur du concept) : *La cité vous connaît* (PNJ à mémoire, accent or) · *Il se passe toujours quelque chose* (events, accent émeraude) · *Des liens qui durent* (RP joueur, accent rose). Survol : léger soulèvement + lueur de l'accent.
4. **Teaser des quartiers** — pastilles dorées des quartiers (Le Grand Marché, Le Quartier Noble, Les Canaux, Le Quartier des Arts, Le Quartier Mystique, Le Port… « et d'autres à venir »). Non figé. Mention « les quartiers se dévoilent au fil du temps ».
5. **Final** — retour au ciel étoilé : « Une autre vie vous attend… vous entrez ? » + bouton « Commencer ici » (→ `/vade-mecum` ou page d'accueil joueur, à définir).

Chaque section apparaît en fondu au défilement (IntersectionObserver). Composants réutilisables, propres, accessibles.

---

## 8 · Le lore en bref (pour cohérence des contenus)

- **Le monde** : une cité fantasy baroque & magique (Venise-de-conte), hors de notre monde. Couleurs riches, merveilleux exubérant mais doux.
- **La magie** : une **texture du quotidien** (lanternes flottantes, sorts ratés, familiers, fontaines enchantées), pas une intrigue épique. Le SoL prime.
- **Les joueurs** : des **habitants** de la cité, rôles variés (artisans, marchands, garde, artistes, nobles, gens des rues, mages…). Pas tous collègues. Une vraie vie hors du « travail ».
- **La structure** : des **quartiers thématiques**, qui peuvent s'ouvrir progressivement.
- **Les PNJ** : incarnés par le bot (avec mémoire) ; leurs personas vivent dans les fichiers du bot, **jamais** sur le site ni dans un canal lisible par les joueurs.

---

## 9 · Conventions de code

- Composants serveur par défaut (App Router) ; client seulement si nécessaire (`"use client"`).
- Tokens DA en variables CSS globales, jamais de couleurs en dur dans les composants.
- Accessibilité : balises sémantiques, `alt`, contraste suffisant, focus visible.
- Commits clairs, atomiques, en français.
