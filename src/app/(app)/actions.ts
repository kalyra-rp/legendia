// Actions serveur de l'espace connecté.
//
// "use server" : tout ce fichier expose des fonctions qui s'exécutent CÔTÉ
// SERVEUR, même quand elles sont déclenchées par un formulaire dans un
// composant client. C'est ce qui permet d'effacer proprement les cookies de
// session avant de rediriger.
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// La déconnexion : on coupe la session Supabase (efface les cookies), puis on
// renvoie au Seuil. Reprise telle quelle de la Phase I (Le Hall).
export async function seDeconnecter() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
