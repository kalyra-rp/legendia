import Hero from "./_components/hero";

/**
 * La homepage de Legendia, la cité des légendes.
 *
 * VERSION PROVISOIRE (incrément 1) : seul le Hero est posé, le temps de
 * basculer tout le socle (tokens, polices, DA) sur le nouveau monde.
 * L'incrément 2 reconstruira la page complète selon CLAUDE.md §7
 * (Hero → Invitation → cartes du concept → teaser quartiers → Final).
 */
export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
