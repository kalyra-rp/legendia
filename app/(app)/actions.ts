"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Action : déconnexion.
 * Appelée par le formulaire du bouton « Se déconnecter » dans la sidebar.
 * On vide la session Supabase (qui efface les cookies d'auth) puis on
 * redirige vers /login.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
