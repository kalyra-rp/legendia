# Legendia

Plateforme web de RP textuel multi-univers.

Stack : Next.js (App Router) + TypeScript + Tailwind, base de données et
auth via Supabase, déploiement sur Vercel.

## Démarrage

```bash
npm install
cp .env.local.example .env.local   # puis remplir les variables
npm run dev
```

Ouvrir http://localhost:3000.

## Architecture : world-scoped

Legendia est pensé comme une plateforme multi-univers. Chaque univers
(« world ») a ses propres personnages, lieux, factions, lore, sessions
de RP, etc. **Toute donnée métier appartient à un world**, jamais à la
plateforme globale.

Concrètement, la quasi-totalité des tables aura une colonne `world_id`,
et les politiques RLS Supabase isoleront chaque univers. Les composants
React et les fonctions serveur prendront `worldId` comme paramètre
explicite plutôt qu'en variable globale.

Le schéma SQL n'est pas encore créé — c'est l'étape suivante.

## Structure des dossiers

```
app/              # Routes (App Router)
components/       # Composants React partagés
lib/              # Code utilitaire serveur + client
  supabase/       # Clients Supabase (browser, server, proxy)
types/            # Types TS partagés (DB, domaines)
proxy.ts          # Refresh de session Supabase sur chaque requête (Next 16+)
```

## Variables d'environnement

Voir `.env.local.example`. La `SUPABASE_SERVICE_ROLE_KEY` est
**strictement server-side** — ne jamais l'utiliser dans un composant
client ni la préfixer `NEXT_PUBLIC_`.
