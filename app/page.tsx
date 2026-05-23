import { createClient } from "@/lib/supabase/server";
import { LocationCard, type Location } from "@/components/LocationCard";

type World = {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
};

/**
 * Écran d'accueil « Le Monde ».
 *
 * Server Component : on lit Supabase directement côté serveur, ce qui évite
 * un état de chargement côté client et garde la RLS active (le client serveur
 * est cookies-aware → les requêtes sont faites au nom de l'utilisateur).
 *
 * Flux :
 *   1. on récupère l'utilisateur (le proxy a déjà filtré les non-connectés) ;
 *   2. on lit son Voyageur pour obtenir current_world_id ;
 *   3. on charge le monde + ses lieux en parallèle ;
 *   4. on dégrade proprement en état vide à chaque étape qui peut échouer.
 */
export default async function HomePage() {
  const supabase = await createClient();

  // 1. Utilisateur courant (toujours présent ici, le proxy redirige sinon).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <EmptyState message="Session expirée." />;
  }

  // 2. Voyageur du joueur.
  const { data: voyageur } = await supabase
    .from("voyageurs")
    .select("id, current_world_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!voyageur || !voyageur.current_world_id) {
    return (
      <EmptyState
        eyebrow="Legendia"
        message="Aucun monde courant."
        detail="Ton Voyageur n'est rattaché à aucun monde pour l'instant."
      />
    );
  }

  // 3. Monde + lieux en parallèle (deux requêtes indépendantes).
  const [worldRes, locationsRes] = await Promise.all([
    supabase
      .from("worlds")
      .select("*")
      .eq("id", voyageur.current_world_id)
      .maybeSingle(),
    supabase
      .from("locations")
      .select(
        "id, name, kind, description, hue, time_label, weather, soundscape",
      )
      .eq("world_id", voyageur.current_world_id)
      .order("name"),
  ]);

  const world = worldRes.data as World | null;
  const locations = (locationsRes.data ?? []) as Location[];

  if (!world) {
    return <EmptyState message="Monde introuvable." />;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
      <header className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          le monde
        </p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
          {world.name}
        </h1>
        {world.tagline && (
          <p className="mt-5 font-serif text-lg italic text-muted sm:text-xl">
            {world.tagline}
          </p>
        )}
        {/* Trait séparateur cuivré, façon papeterie de voyage. */}
        <span
          aria-hidden
          className="mx-auto mt-8 block h-px w-16 bg-copper opacity-60"
        />
      </header>

      {locations.length === 0 ? (
        <p className="mt-20 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted">
          aucun lieu pour l'instant
        </p>
      ) : (
        <section className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc, i) => (
            <LocationCard key={loc.id} location={loc} index={i} />
          ))}
        </section>
      )}
    </main>
  );
}

function EmptyState({
  eyebrow = "Legendia",
  message,
  detail,
}: {
  eyebrow?: string;
  message: string;
  detail?: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink sm:text-4xl">
        {message}
      </h1>
      {detail && (
        <p className="mt-3 max-w-md font-serif text-base italic text-muted">
          {detail}
        </p>
      )}
    </main>
  );
}
