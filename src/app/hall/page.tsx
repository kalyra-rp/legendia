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

  // On lit SON profil dans la table `profils`. Grâce à la RLS, cette requête
  // ne peut renvoyer que la ligne de l'utilisateur connecté — impossible de
  // lire celle de quelqu'un d'autre, même en trafiquant la requête.
  const { data: profil } = await supabase
    .from("profils")
    .select("pseudo, avatar_url, role")
    .eq("id", user.id)
    .single();

  // On affiche en priorité les infos de la table ; à défaut, on retombe sur
  // les métadonnées Discord (utile juste après l'inscription).
  const meta = user.user_metadata ?? {};
  const pseudo =
    profil?.pseudo ??
    meta.full_name ??
    meta.name ??
    meta.user_name ??
    user.email ??
    "voyageur·euse";
  const avatar = (profil?.avatar_url ?? meta.avatar_url) as string | undefined;
  const role = profil?.role ?? "membre";

  // Habillage du badge de rôle selon le niveau.
  const roleStyle: Record<string, string> = {
    admin: "border-coral text-coral-d",
    moderateur: "border-sun-d text-sun-d",
    membre: "border-leaf-d text-leaf-d",
  };
  const roleLabel: Record<string, string> = {
    admin: "Admin",
    moderateur: "Modération",
    membre: "Membre",
  };

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

        {/* Badge de rôle, lu depuis la table profils. */}
        <span
          className={`mt-4 inline-block rounded-full border-2 bg-card px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] ${
            roleStyle[role] ?? roleStyle.membre
          }`}
        >
          {roleLabel[role] ?? role}
        </span>

        <p className="mx-auto mt-4 max-w-sm text-ink-soft">
          Le verrou fonctionne : cette page n’est visible qu’une fois connecté·e
          via Discord, et ton rôle est lu depuis la base. Bienvenue à
          Legendia. 🌺
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
