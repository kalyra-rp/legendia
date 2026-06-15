import Eyebrow from "./eyebrow";
import GoldDust from "./gold-dust";
import Ornament from "./ornament";

/**
 * Hero — plein écran. Fond cuir, vignette, particules dorées,
 * titre en or à la feuille avec reflet qui balaie, accroche, et
 * l'indice de défilement en bas.
 */
export default function Hero() {
  return (
    <header className="vignette relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-leather px-6 py-24 text-center">
      {/* particules (décor, derrière le contenu) */}
      <GoldDust />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-7">
        <Eyebrow className="text-ink-soft">
          Registre des âmes &amp; des lieux
        </Eyebrow>

        <h1 className="gold-leaf gold-sweep font-display text-7xl font-bold leading-none tracking-wide sm:text-8xl">
          Legendia
        </h1>

        <Ornament className="w-60 text-gold sm:w-72" />

        <p className="max-w-xl font-body text-lg italic leading-relaxed text-ink-soft sm:text-xl">
          Sous les chênes et la mousse, Savannah tient registre de ses âmes —
          celles qu'on montre, et celles qu'on tait.
        </p>

        <p className="eyebrow text-ink-dim">
          Savannah · Géorgie · Anno 2026
        </p>
      </div>

      {/* indice de défilement */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="scroll-cue flex flex-col items-center gap-2 text-ink-dim">
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
