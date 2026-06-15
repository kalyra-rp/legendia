import Colophon from "./_components/colophon";
import Folio from "./_components/folio";
import Frontispice from "./_components/frontispice";
import Hero from "./_components/hero";
import Inscriptions from "./_components/inscriptions";
import Plaques from "./_components/plaques";
import Reveal from "./_components/reveal";

/**
 * La homepage : un registre ancien qu'on parcourt en descendant.
 * Le Hero est au-dessus de la ligne de flottaison → affiché d'emblée.
 * Chaque section suivante apparaît en fondu au défilement (<Reveal>).
 */
export default function Home() {
  return (
    <main>
      <Hero />

      <Reveal>
        <Frontispice />
      </Reveal>

      <Reveal>
        <Plaques />
      </Reveal>

      <Reveal>
        <Folio />
      </Reveal>

      <Reveal>
        <Inscriptions />
      </Reveal>

      <Reveal>
        <Colophon />
      </Reveal>
    </main>
  );
}
