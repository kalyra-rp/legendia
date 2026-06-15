# CLAUDE.md — Legendia

> Fichier de cadrage lu par Claude Code à chaque session. Il décrit **ce qu'on construit**, **comment**, et **les règles à respecter**. À garder à jour quand le projet évolue.

---

## 1 · Le projet en une phrase

**Legendia** est un univers de jeu de rôle narratif inspiré de la série *Grimm* : à **Savannah, Géorgie, en 2026**, des créatures issues du folklore mondial — les **Deep** — vivent cachées parmi les humains. Le projet comprend deux briques :

1. **Le site** (priorité actuelle) — un « registre vivant » : le lore, l'atlas de la ville, l'enquête. Next.js + Supabase, déployé sur Vercel.
2. **Le bot Discord** (plus tard) — un maître de jeu IA (API Claude) qui incarne les PNJ du quotidien et anime le monde. **À ne pas commencer tant que le site n'est pas posé.**

---

## 2 · Règles de collaboration (importantes)

- **Toujours montrer un plan avant d'agir** sur une tâche non triviale. Pas de refactor massif ou de suppression sans validation.
- **Avancer par petits incréments validables.** Une chose à la fois, qui marche, qu'on voit.
- **Ne jamais toucher aux fichiers d'infra sans demander** : `.env*`, config Vercel, clés Supabase.
- **Ne jamais commiter de secret.** Les `.env*` restent gitignorés.
- **Demander avant d'introduire une nouvelle dépendance lourde.** Préférer le standard (Next.js App Router, Supabase JS) au foisonnement de librairies.
- Le code et les commentaires peuvent être en français (c'est un projet francophone).

---

## 3 · Ordre de construction

**Phase 1 — le socle du site** (ici, maintenant)
1. Initialiser Next.js (App Router, TypeScript, Tailwind).
2. Poser le système de design (tokens DA ci-dessous).
3. Construire la **homepage** (maquette déjà validée, voir §5).

**Phase 2 — étendre le site**
- L'Atlas (carte de Savannah + fiches-lieux)
- Le Registre (encyclopédie du lore)
- Le Dossier (enquête vivante, alimentée plus tard)
- Le Vade-mecum (hors-fiction : règles, création de perso)

**Phase 3 — le bot Discord** (chantier séparé, plus tard)

---

## 4 · Stack technique

- **Framework** : Next.js (App Router), TypeScript
- **Style** : Tailwind CSS, avec les tokens de la DA en variables CSS
- **Données** : Supabase (Postgres). Le schéma `public` est actuellement **vide** (reset complet effectué).
- **Déploiement** : Vercel (déjà connecté au repo)
- **Polices** : Cormorant (titres) + EB Garamond (corps) — Google Fonts
- Variables d'environnement documentées dans `.env.example`

---

## 5 · Direction artistique (la DA est NON négociable)

Le concept directeur : **le site EST un registre ancien** — un beau document hérité, du vieux Sud raffiné, qui consigne aussi ce que les registres ordinaires taisent. Élégant et chaud en surface, inquiétant en dessous.

**Palette (variables CSS)**
```
--abyss:    #0e0a06   /* fond, noir chaud */
--leather:  #181109   /* panneaux */
--leather2: #221810
--ink:      #ece0c6   /* texte sur fond sombre */
--ink-soft: #b6a079
--ink-dim:  #7d6c4f
--marsh:    #6f8466   /* vert marais, accents discrets */
--gold:     #c8a35c   /* or principal */
--gold-hi:  #f1d79a   /* reflet or */
--gold-lo:  #8a6a30   /* or sombre */
--oxide:    #b04632   /* rouge oxydé — RARE, réservé à « ce qui cloche » */
--line:     #3c2f1d   /* filets, bordures */
```

**Typographie**
- Titres : **Cormorant** (serif gravé, élégant), poids 500–700
- Corps : **EB Garamond** (livresque)
- Annotations in-world : une cursive manuscrite (ex. Petit Formal Script), en `--oxide`
- Petits labels : Cormorant en petites capitales, letter-spacing large

**Signatures visuelles**
- **L'or à la feuille** : titres en dégradé `--gold-lo → --gold → --gold-hi → --gold` avec reflet qui balaie lentement.
- **L'annotation en marge** : une main inconnue écrit en rouge oxydé dans la marge — c'est ce qui transforme le bel objet en dossier. Élément récurrent.
- **Le chêne & la mousse espagnole** : motif décoratif (séparateurs, en-têtes).
- **Le sceau** : monogramme « L » dans une couronne de chêne, MMXXVI. Logo officiel.
- **Texture** : grain de papier subtil, vignette, fines particules dorées qui dérivent (ambiance bougie). Respecter `prefers-reduced-motion`.

**Principe** : dépenser l'audace à un seul endroit (le titre or, l'annotation rouge), garder tout le reste sobre et discipliné. Pas de surcharge.

**Qualité de base** : responsive jusqu'au mobile, focus clavier visible, motion réduite respectée.

---

## 6 · Le lore en bref (pour cohérence des contenus)

- **Les créatures** = les **Deep**. Forme humaine permanente + **empreinte** involontaire (animaux qui fuient, tech qui bugue, plantes qui réagissent, coïncidences) + **rupture** fugace sous stress extrême.
- **Trois couches** de Deep : fond sudiste (les plus anciens, vieilles familles) / couche atlantique (arrivés par le port) / les récents.
- **Les joueurs incarnent uniquement des humains.** Les Deep sont joués par le staff et le bot. Jamais de Deep jouable.
- **Niveaux de connaissance** : Ignorant → Douteur → Initié → Veilleur. Choisis à la création ou atteints par éveil en jeu.
- **V1 du site : tout le lore est public.** L'ignorance se joue, elle n'est pas imposée par le site. (Contenu gradué = V2 éventuelle.)
- Les **personas des PNJ** ne sont jamais sur le site ni dans Discord : ils vivront dans les fichiers du bot.

---

## 7 · Conventions de code

- Composants serveur par défaut (App Router) ; client uniquement si nécessaire (`"use client"`).
- Tokens DA en variables CSS globales, jamais de couleurs en dur dans les composants.
- Accessibilité : balises sémantiques, `alt`, contraste suffisant.
- Commits clairs et atomiques, en français.
