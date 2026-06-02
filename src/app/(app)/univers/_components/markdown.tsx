// LE RENDU MARKDOWN — sûr et stylé.
//
// Tout le texte riche du lore est stocké en MARKDOWN en base (jamais de HTML).
// On le rend avec react-markdown + remark-gfm (qui gère les listes, liens,
// gras/italique « façon GitHub »).
//
// SÉCURITÉ : par défaut, react-markdown N'INTERPRÈTE PAS le HTML brut qu'on
// glisserait dans le texte (il faudrait ajouter le plugin rehype-raw pour ça,
// ce qu'on se garde bien de faire). Une balise <script> écrite dans un champ
// ressortirait donc en texte inerte, pas en code exécuté → pas de XSS.
//
// "use client" : react-markdown s'exécute côté navigateur. Le composant ne
// reçoit qu'une simple chaîne, on peut donc l'appeler depuis nos pages serveur.
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// On mappe chaque élément markdown vers nos classes Tailwind, pour rester dans
// l'identité Legendia (encre douce, liens indigo, listes aérées). Comme ça,
// pas besoin du plugin typography : on maîtrise chaque balise.
const composants = {
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-3 last:mb-0 text-ink-soft" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  em: (props: React.ComponentProps<"em">) => (
    <em className="italic" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-3 last:mb-0 list-disc space-y-1 pl-5 text-ink-soft" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mb-3 last:mb-0 list-decimal space-y-1 pl-5 text-ink-soft" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="marker:text-faint" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="font-medium text-indigo underline decoration-indigo/30 underline-offset-2 hover:decoration-indigo"
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mb-2 mt-4 font-display text-lg font-semibold text-ink" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="my-3 border-l-2 border-line-2 pl-4 font-display italic text-ink-soft"
      {...props}
    />
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={composants}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
