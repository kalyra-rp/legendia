# CLAUDE.md — Legendia

> Fichier de cadrage pour Claude Code. À lire en priorité à chaque session.

## Ce qu'est Legendia

Legendia est une **plateforme web de jeu de rôle textuel (RP) narratif**, en français, de type **slice of life** (simulation de vie douce, réaliste, contemporaine). C'est un **studio mono-éditeur** : la fondatrice (Kalyra) crée elle-même les univers ; les autres membres sont joueurs ou staff.

Le premier univers est **Saint-Pierre 974** : la vraie ville de Saint-Pierre, à La Réunion, restituée fidèlement. Les joueurs y incarnent des habitants ordinaires et vivent un quotidien (boulot, amours, amitiés) au rythme de l'île.

La plateforme est animée par un **MJ assisté par IA** (le « Gardien ») : un narrateur doux qui pose l'ambiance, joue les PNJ et rythme la vie au mois. Il est appelé par des boutons dans l'interface de scène, jamais imposé.

## Philosophie produit

- **Doux, lisible, anti-bruit.** L'inverse de Discord : du calme, de l'air, pas de flux anxiogène, pas de notifications qui harcèlent.
- **Le rythme respire** : on joue au mois, pas en temps réel pressant.
- **Bienveillance** : petite communauté, haute exigence d'égards.

## Stack technique

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** pour les styles
- **Supabase** : base de données (Postgres), authentification, storage, temps réel
- **Vercel** : hébergement + déploiement automatique à chaque push
- **Claude API** (Anthropic) : le moteur narratif du MJ
- **GitHub** : versionnement

## Méthode de travail

1. **On suit la roadmap** dans `/docs/legendia-roadmap.html`, **phase par phase**, tâche par tâche. On ne saute pas d'étape.
2. **Une couche finie avant la suivante.** Chaque bout doit marcher (et être déployé) avant d'attaquer le prochain.
3. **Pushe souvent, pushe petit.** Petits commits clairs, déploiement continu.
4. **Le "moche-qui-marche" d'abord**, le polish ensuite.
5. **Explique ce que tu fais.** Ce projet est aussi l'apprentissage de Kalyra (Next.js + Supabase). Commente, justifie les choix, enseigne — ne produis jamais du code qu'elle ne pourrait pas comprendre.

## Documents de référence (dans /docs)

- `legendia-roadmap.html` — la feuille de route de développement (LA référence d'avancement)
- `legendia-plateforme-archi.html` — l'architecture d'ensemble (les espaces, l'emboîtement)
- `legendia-structure.html` — onglets, boards (membre/modo/admin), flow d'accès, permissions
- `legendia-mj.html` — la conception du MJ (philosophie, facettes, invocation, garde-fous)
- `legendia-univers-saintpierre.html` — la bible de l'univers Saint-Pierre (lieux, PNJ, culture, calendrier, cadre de jeu)

Consulte ces documents quand une tâche les concerne (ex : créer le formulaire de perso → lire le chapitre VI de la bible ; brancher le MJ → lire la spec du MJ).

## Règles de sécurité — NON NÉGOCIABLES

- **Aucun secret dans le code.** Les clés (Supabase, Claude API, Discord) vont dans les **variables d'environnement** (`.env.local` en local, variables Vercel en prod). Jamais en dur dans le code, jamais commitées.
- Le fichier `.env.local` doit être dans le `.gitignore`.
- La clé Claude API ne doit **jamais** être exposée côté navigateur : les appels au MJ passent par une route serveur (API route Next.js).

## Le flow d'accès (important pour l'auth)

Discord sert de **portier** : on rejoint le serveur Discord (vitrine + filtrage), on valide la charte, puis on accède à la plateforme. La connexion au site se fait **via Discord (OAuth)**, et l'accès est conditionné à l'**appartenance au serveur** : si la personne quitte ou est bannie du Discord, elle perd l'accès au site.

## Rôles & permissions

Trois niveaux dès le départ (colonne `role` en base) :
- **membre** : jouer, créer ses persos, écrire
- **modérateur** : valider les fiches, modérer, épauler le MJ
- **admin** (Kalyra) : créer les univers, gérer les rôles, piloter le MJ, annonces

Au lancement, Kalyra est seule admin ; les rôles modo existent dans le code mais ne sont attribués à personne.

## Ton & langue

- Tout en **français** (interface, contenu, commentaires de code peuvent être en français).
- Identité visuelle : chaleureuse, colorée, créative (corail, indigo, soleil, vert, sur fond crème). Pas de sombre criard.