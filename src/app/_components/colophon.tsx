import Ornament from "./ornament";
import Seal from "./seal";

/**
 * Colophon — la clôture du registre : le sceau, la devise, le millésime.
 */
export default function Colophon() {
  return (
    <footer className="flex flex-col items-center gap-6 px-6 py-28 text-center">
      <Seal className="w-24 text-gold" />

      <Ornament className="w-40 text-line" />

      <p className="font-display text-2xl italic text-ink-soft sm:text-3xl">
        les Deep marchent parmi nous
      </p>

      <p className="eyebrow text-ink-dim">Legendia · MMXXVI</p>
    </footer>
  );
}
