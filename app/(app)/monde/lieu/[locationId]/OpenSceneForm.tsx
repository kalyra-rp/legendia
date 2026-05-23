"use client";

import { useActionState, useState } from "react";
import { openScene, type OpenSceneState } from "./actions";

export type Candidate = {
  incarnationId: string;
  incarnationTitle: string | null;
  voyageurName: string;
};

type Props = {
  locationId: string;
  candidates: Candidate[];
};

const MAX_PARTNERS = 3;

/**
 * Formulaire d'ouverture de scène (Client Component).
 *
 * - useActionState : appelle le Server Action `openScene` et garde la
 *   dernière erreur retournée pour l'afficher.
 * - useState local : suit le set des partenaires cochés pour pouvoir
 *   désactiver les autres cases une fois la limite atteinte.
 *
 * Une scène est FERMÉE à 4 participants max ; comme je suis d'office le
 * 4e (l'organisateur), on coche jusqu'à 3 partenaires.
 */
export function OpenSceneForm({ locationId, candidates }: Props) {
  const [state, formAction, pending] = useActionState<OpenSceneState, FormData>(
    openScene,
    null,
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const canSubmit =
    !pending && selected.size >= 1 && selected.size <= MAX_PARTNERS;
  const limitReached = selected.size >= MAX_PARTNERS;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locationId" value={locationId} />

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Titre de la scène
        </label>
        <input
          type="text"
          name="title"
          required
          minLength={2}
          maxLength={120}
          placeholder="Une rencontre sous la verrière…"
          className="mt-2 w-full rounded-md border border-line bg-paper px-4 py-3 font-serif text-base text-ink shadow-inner outline-none transition focus:border-verdigris focus:ring-2 focus:ring-verdigris/30"
        />
      </div>

      <fieldset>
        <legend className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Partenaires ({selected.size}/{MAX_PARTNERS}, choisis-en 1 à {MAX_PARTNERS})
        </legend>

        {candidates.length === 0 ? (
          <p className="mt-3 font-serif text-sm italic text-muted">
            Aucun autre Voyageur validé n'est dans ce monde pour l'instant.
            Reviens plus tard, ou invite quelqu'un sur le Discord.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {candidates.map((c) => {
              const isChecked = selected.has(c.incarnationId);
              const disabled = !isChecked && limitReached;
              return (
                <label
                  key={c.incarnationId}
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition",
                    isChecked
                      ? "border-verdigris bg-verdigris/10"
                      : "border-line bg-paper hover:border-copper",
                    disabled && "cursor-not-allowed opacity-50",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <input
                    type="checkbox"
                    name="partnerIds"
                    value={c.incarnationId}
                    checked={isChecked}
                    disabled={disabled}
                    onChange={(e) =>
                      toggle(c.incarnationId, e.target.checked)
                    }
                    className="h-4 w-4 accent-verdigris-deep"
                  />
                  <span className="flex flex-col">
                    <span className="font-display text-base text-ink">
                      {c.voyageurName}
                    </span>
                    {c.incarnationTitle && (
                      <span className="font-serif text-xs italic text-muted">
                        {c.incarnationTitle}
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

      {state && "error" in state && (
        <p className="rounded-md border border-copper/40 bg-copper/10 px-4 py-3 font-serif text-sm text-ink">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex items-center gap-3 rounded-full bg-verdigris-deep px-7 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-paper shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-verdigris disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {pending ? "Ouverture…" : "Ouvrir la scène →"}
      </button>
    </form>
  );
}
