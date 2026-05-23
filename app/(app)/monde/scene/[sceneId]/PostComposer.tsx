"use client";

import { useActionState, useEffect, useRef } from "react";
import { publishPost, type PublishPostState } from "./actions";

type Props = {
  sceneId: string;
  /** Le composer accepte la saisie si true. Sinon : désactivé, message doux. */
  enabled: boolean;
  /** Nom du perso dont on attend le tour (utilisé quand enabled=false). */
  waitingForName: string | null;
};

/**
 * Composer de post (Client Component).
 *
 * - Si `enabled` est false : textarea + bouton désactivés, on affiche un
 *   message doux « En attente du tour de … ». On laisse le formulaire
 *   monté pour que la transition vers l'état actif (quand le tour vient)
 *   ne nécessite pas de re-mount visible.
 * - À chaque succès (state.ok + clearKey), on reset le textarea.
 *
 * Garde : la vraie vérification du tour est dans le Server Action,
 * publishPost. Le `enabled` ici n'est qu'une commodité d'UX.
 */
export function PostComposer({ sceneId, enabled, waitingForName }: Props) {
  const [state, formAction, pending] = useActionState<PublishPostState, FormData>(
    publishPost,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  const inputBase =
    "mt-2 w-full resize-y rounded-md border bg-paper px-4 py-3 font-serif text-base leading-relaxed text-ink shadow-inner outline-none transition";
  const inputEnabled =
    "border-line focus:border-verdigris focus:ring-2 focus:ring-verdigris/30";
  const inputDisabled = "border-line/60 cursor-not-allowed opacity-60";

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="sceneId" value={sceneId} />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Ta plume
        </span>
        <textarea
          name="body"
          required
          minLength={1}
          rows={6}
          disabled={!enabled || pending}
          placeholder={
            enabled
              ? "Écris ta partie de la scène…"
              : "Le composer s'activera quand ce sera ton tour."
          }
          className={`${inputBase} ${enabled ? inputEnabled : inputDisabled}`}
        />
      </label>

      {!enabled && waitingForName && (
        <p className="text-center font-serif text-sm italic text-muted">
          En attente du tour de {waitingForName}.
        </p>
      )}

      {state && "error" in state && (
        <p className="rounded-md border border-copper/40 bg-copper/10 px-4 py-3 font-serif text-sm text-ink">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={!enabled || pending}
          className="inline-flex items-center gap-3 rounded-full bg-verdigris-deep px-7 py-3 font-mono text-xs uppercase tracking-[0.22em] text-paper shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-verdigris disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {pending ? "Publication…" : "Publier"}
        </button>
      </div>
    </form>
  );
}
