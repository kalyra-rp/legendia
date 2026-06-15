import { plaques } from "../_data/homepage";
import Eyebrow from "./eyebrow";
import Ornament from "./ornament";
import Plaque from "./plaque";

/**
 * Plaques — les trois entrées du registre (Atlas / Registre / Gazette),
 * présentées comme trois plaques gravées I / II / III.
 */
export default function Plaques() {
  return (
    <section
      aria-labelledby="plaques-titre"
      className="mx-auto max-w-5xl px-6 py-24"
    >
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <Eyebrow className="text-gold">Les trois entrées</Eyebrow>
        <h2
          id="plaques-titre"
          className="font-display text-4xl font-medium text-ink sm:text-5xl"
        >
          Par où entrer dans le monde
        </h2>
        <Ornament className="w-48 text-line" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plaques.map((plaque) => (
          <Plaque key={plaque.href} {...plaque} />
        ))}
      </div>
    </section>
  );
}
