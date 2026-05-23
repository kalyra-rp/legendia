import { createClient } from "@/lib/supabase/server";
import { ZoneCard, type Zone } from "@/components/ZoneCard";

type World = { id: string; name: string; tagline?: string | null };

/**
 * Écran « Le Monde » — Server Component.
 *
 * Niveau 1 de la hiérarchie Monde → Zones → Lieux.
 * On affiche les ZONES du monde courant, triées par sort_order puis name.
 * Chaque carte → /monde/zone/[id].
 */
export default async function MondePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <EmptyState message="Session expirée." />;

  const { data: voyageur } = await supabase
    .from("voyageurs")
    .select("id, current_world_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!voyageur || !voyageur.current_world_id) {
    return (
      <EmptyState
        message="Aucun monde courant."
        detail="Ton Voyageur n'est rattaché à aucun monde pour l'instant."
      />
    );
  }

  // Monde + zones en parallèle.
  const [worldRes, zonesRes] = await Promise.all([
    supabase
      .from("worlds")
      .select("*")
      .eq("id", voyageur.current_world_id)
      .maybeSingle(),
    supabase
      .from("zones")
      .select("id, name, kind, description, hue, sort_order")
      .eq("world_id", voyageur.current_world_id)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("name", { ascending: true }),
  ]);

  const world = worldRes.data as World | null;
  const zones = (zonesRes.data ?? []) as Zone[];

  if (!world) return <EmptyState message="Monde introuvable." />;

  return (
    // Le <main> et le cadrage extérieur sont fournis par le layout (app).
    // Le « retour au Carnet » est désormais dans la sidebar — pas besoin
    // de BackLink ici.
    <div>
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
        <span
          aria-hidden
          className="mx-auto mt-8 block h-px w-16 bg-copper opacity-60"
        />
      </header>

      {zones.length === 0 ? (
        <p className="mt-20 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted">
          aucune zone pour l'instant
        </p>
      ) : (
        <section className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((z, i) => (
            <ZoneCard key={z.id} zone={z} index={i} />
          ))}
        </section>
      )}
    </div>
  );
}

function EmptyState({
  message,
  detail,
}: {
  message: string;
  detail?: string;
}) {
  // On reste dans le châssis : <div> centré, pas de min-h-screen qui ferait
  // déborder hors du layout parent.
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        Legendia
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink sm:text-4xl">
        {message}
      </h1>
      {detail && (
        <p className="mt-3 max-w-md font-serif text-base italic text-muted">
          {detail}
        </p>
      )}
    </div>
  );
}
