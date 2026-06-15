import Eyebrow from "./eyebrow";

/**
 * Hero — plein écran, ambiance nuit enchantée (CLAUDE.md §7.1).
 *
 * VERSION PROVISOIRE (incrément 1) : le fond pourpre, le titre en or et
 * la tagline sont posés. Le ciel étoilé + lanternes dérivantes, l'emblème
 * lanterne-étoile, le cadre baroque et les boutons arriveront à
 * l'incrément 2 (reconstruction complète de la homepage).
 */
export default function Hero() {
  return (
    <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-night2 via-night to-night px-6 py-24 text-center">
      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-7">
        <Eyebrow className="text-soft">La cité des légendes</Eyebrow>

        <h1 className="gold-leaf gold-sweep font-display text-7xl font-bold leading-none tracking-wide sm:text-8xl">
          Legendia
        </h1>

        <p className="script text-5xl leading-none sm:text-6xl">
          Venez vivre une autre vie
        </p>

        <p className="max-w-xl font-body text-lg leading-relaxed text-soft sm:text-xl">
          Une cité somptueuse et magique qui ne dort jamais. On y habite,
          autrement — et il s'y passe toujours quelque chose.
        </p>
      </div>

      {/* indice de défilement */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="scroll-cue flex flex-col items-center gap-2 text-dim">
          <span className="eyebrow text-[0.62rem]">Descendez</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </header>
  );
}
