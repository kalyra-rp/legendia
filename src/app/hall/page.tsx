// LE HALL — page protégée de test (Phase I).
//
// Composant serveur : il lit la session AVANT de rendre quoi que ce soit.
// Si personne n'est connecté, on renvoie au Seuil. Sinon, on salue la personne.
// C'est la preuve que le verrou d'accès fonctionne.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server Action : la déconnexion se fait CÔTÉ SERVEUR.
// Avantage : elle efface proprement les cookies de session, puis redirige.
async function seDeconnecter() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function HallPage() {
  const supabase = await createClient();

  // getUser() VALIDE la session auprès de Supabase (plus sûr que de faire
  // confiance au seul cookie local). Sans utilisateur → pas le droit d'être ici.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Discord remplit ces champs dans user_metadata. On prend le premier dispo
  // pour afficher un pseudo lisible.
  const meta = user.user_metadata ?? {};
  const pseudo =
    meta.full_name ??
    meta.name ??
    meta.user_name ??
    meta.preferred_username ??
    user.email ??
    "voyageur·euse";
  const avatar = meta.avatar_url as string | undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <span className="inline-block rounded-full border-2 border-leaf-d bg-card px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-leaf-d">
          Le Hall · page protégée
        </span>

        {avatar && (
          // Avatar Discord. On utilise une balise <img> simple pour ne pas avoir
          // à déclarer le domaine Discord dans la config de next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            width={72}
            height={72}
            className="mx-auto mt-6 h-18 w-18 rounded-full border-2 border-line-2 shadow-md"
          />
        )}

        <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Connecté·e en tant que{" "}
          <span className="text-indigo">{pseudo}</span>
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-ink-soft">
          Le verrou fonctionne : cette page n’est visible qu’une fois connecté·e
          via Discord. Bienvenue à Legendia. 🌺
        </p>

        <form action={seDeconnecter} className="mt-8">
          <button
            type="submit"
            className="rounded-full border-2 border-line-2 bg-card px-6 py-2.5 font-semibold text-ink-soft transition hover:border-coral hover:text-coral-d"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </main>
  );
}
