"use client";

import { useFormStatus } from "react-dom";
import { signOut } from "../actions";

/**
 * Bouton de déconnexion. Discret, en pied de sidebar.
 *
 * On utilise `useFormStatus` (Client Component) pour afficher un état
 * « Déconnexion… » pendant que le Server Action tourne.
 */
function SubmitText() {
  const { pending } = useFormStatus();
  return <>{pending ? "Déconnexion…" : "Se déconnecter"}</>;
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted underline-offset-4 transition hover:text-copper hover:underline"
      >
        <SubmitText />
      </button>
    </form>
  );
}
