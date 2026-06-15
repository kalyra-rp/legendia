import Marginalia from "./marginalia";

/**
 * Frontispice — le texte d'ouverture, avec lettrine, et l'annotation
 * en marge (l'élément signature). En large, la note flotte dans la
 * marge de droite ; en mobile, elle passe sous le texte.
 */
export default function Frontispice() {
  return (
    <section
      aria-labelledby="frontispice-titre"
      className="mx-auto max-w-3xl px-6 py-28"
    >
      <h2 id="frontispice-titre" className="sr-only">
        Frontispice
      </h2>

      <div className="relative">
        <p className="lettrine font-body text-lg leading-loose text-ink sm:text-xl">
          Savannah se raconte volontiers : ses places ombragées, ses demeures
          d'avant-guerre, la politesse lente du vieux Sud. Mais sous cette belle
          page court une seconde écriture — celle des <em>Deep</em>, ces êtres
          du folklore du monde entier qui ont pris forme humaine et vivent,
          depuis des générations, à hauteur de regard. Le présent registre les
          consigne, autant que les registres ordinaires les passent sous
          silence.
        </p>

        <Marginalia className="mt-8 lg:absolute lg:-right-44 lg:top-2 lg:mt-0 lg:w-36 lg:text-right">
          tout n'y est pas — et ce qui manque a été retiré exprès.
        </Marginalia>
      </div>
    </section>
  );
}
