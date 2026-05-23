import { redirect } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";

/* ─────────────────────────────────────────────────────────────────────────
   Types — minimaux et locaux. On les extraira dans /types quand on
   commencera à les partager entre plusieurs pages.
   ───────────────────────────────────────────────────────────────────────── */

type Voyageur = {
  id: string;
  name: string;
  bio: string | null;
  hue: number | null;
  xp: number;
  level: number;
  rank_name: string | null;
  current_world_id: string | null;
  final_page_unlocked: boolean | null;
};

type World = { id: string; name: string; tagline: string | null };

type Stamp = {
  id: string;
  kind: "arrivee" | "visa" | "distinction";
  label: string;
  sublabel: string | null;
  occurred_label: string | null;
  world_id: string | null;
};

type BadgeRow = {
  badge_id: string;
  world_id: string | null;
  badges: {
    id: string;
    label: string;
    emoji: string | null;
    description: string | null;
  } | null;
};

type OngoingScene = {
  id: string;
  title: string;
  status: "open" | "active" | "closed" | "archived";
  updated_at: string;
  locationName: string | null;
};

/* ─────────────────────────────────────────────────────────────────────────
   Dashboard ( / )
   Server Component. Logique : qui es-tu → où es-tu → ce que tu as accompli.
   ───────────────────────────────────────────────────────────────────────── */

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Utilisateur connecté. Le proxy garantit qu'il y en a un, mais on
  // garde une garde défensive au cas où.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Voyageur du joueur. S'il n'existe pas → on l'envoie créer le sien.
  const { data: voyageur } = await supabase
    .from("voyageurs")
    .select(
      "id, name, bio, hue, xp, level, rank_name, current_world_id, final_page_unlocked",
    )
    .eq("user_id", user.id)
    .maybeSingle<Voyageur>();

  if (!voyageur) redirect("/arrivee");

  // 3. En parallèle : monde courant, tampons (du plus récent au plus ancien),
  // badges, ET mes incarnations (utilisées juste après pour les scènes).
  const [worldRes, stampsRes, badgesRes, incsRes] = await Promise.all([
    voyageur.current_world_id
      ? supabase
          .from("worlds")
          .select("id, name, tagline")
          .eq("id", voyageur.current_world_id)
          .maybeSingle<World>()
      : Promise.resolve({ data: null as World | null }),
    supabase
      .from("carnet_stamps")
      .select("id, kind, label, sublabel, occurred_label, world_id")
      .eq("voyageur_id", voyageur.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("voyageur_badges")
      .select("badge_id, world_id, badges ( id, label, emoji, description )")
      .eq("voyageur_id", voyageur.id),
    supabase
      .from("incarnations")
      .select("id")
      .eq("voyageur_id", voyageur.id),
  ]);

  const currentWorld = worldRes.data;
  const stamps = (stampsRes.data ?? []) as Stamp[];
  const badges = (badgesRes.data ?? []) as unknown as BadgeRow[];
  const myIncIds = (incsRes.data ?? []).map((i) => i.id as string);

  // 4. Scènes en cours : toutes les scènes dont une de mes incarnations est
  // participante ET dont le status est 'open' ou 'active'. On part de
  // scene_participants pour pouvoir filtrer par mes incarnations en un seul
  // appel, on embed la scène (et son lieu) via `!inner` pour éviter trois
  // requêtes successives. On trie par `scenes.updated_at desc`.
  let ongoingScenes: OngoingScene[] = [];
  if (myIncIds.length > 0) {
    const { data: parts } = await supabase
      .from("scene_participants")
      .select(
        "scenes!inner(id, title, status, updated_at, locations(id, name))",
      )
      .in("incarnation_id", myIncIds)
      .in("scenes.status", ["open", "active"])
      .order("updated_at", {
        ascending: false,
        referencedTable: "scenes",
      });

    // Normalisation : Supabase peut renvoyer l'embed en objet ou tableau
    // selon la résolution de la FK ; on aplatit et on déduplique par id.
    const seen = new Set<string>();
    for (const row of (parts ?? []) as unknown as Array<{
      scenes:
        | {
            id: string;
            title: string;
            status: OngoingScene["status"];
            updated_at: string;
            locations: { id: string; name: string } | { id: string; name: string }[] | null;
          }
        | null;
    }>) {
      const scene = row.scenes;
      if (!scene || seen.has(scene.id)) continue;
      seen.add(scene.id);
      const loc = Array.isArray(scene.locations)
        ? scene.locations[0] ?? null
        : scene.locations;
      ongoingScenes.push({
        id: scene.id,
        title: scene.title,
        status: scene.status,
        updated_at: scene.updated_at,
        locationName: loc?.name ?? null,
      });
    }
  }

  // Seuil d'XP provisoire : niveau × 1000. À affiner avec la vraie courbe
  // de progression du jeu plus tard.
  const threshold = Math.max(1, voyageur.level) * 1000;
  const pct = Math.min(100, Math.round((voyageur.xp / threshold) * 100));

  return (
    // Le <main> et la mise en page extérieure sont fournis par le layout du
    // groupe (app). Ici on se contente d'un <div> structurant.
    <div>
      {/* ───────────────────────── LE CARNET ───────────────────────── */}
      <section aria-labelledby="carnet-title">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          le voyageur
        </p>

        <h1
          id="carnet-title"
          className="mt-3 font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl"
        >
          {voyageur.name}
        </h1>

        {voyageur.rank_name && (
          <p className="mt-2 font-serif text-lg italic text-muted">
            {voyageur.rank_name}
          </p>
        )}

        <XPBar
          level={voyageur.level}
          xp={voyageur.xp}
          threshold={threshold}
          pct={pct}
        />

        {currentWorld && <DestinationTicket world={currentWorld} />}

        {/* TAMPONS */}
        <div className="mt-14">
          <SectionLabel>Tampons du Carnet</SectionLabel>
          {stamps.length === 0 ? (
            <EmptyHint>
              Pas encore de tampon. Ton premier voyage en posera un.
            </EmptyHint>
          ) : (
            <div className="mt-5 flex flex-wrap gap-5">
              {stamps.map((s, i) => (
                <StampVignette key={s.id} stamp={s} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* BADGES */}
        <div className="mt-12">
          <SectionLabel>Badges</SectionLabel>
          {badges.length === 0 ? (
            <EmptyHint>Aucun badge décroché — pour l'instant.</EmptyHint>
          ) : (
            <div className="mt-5 flex flex-wrap gap-3">
              {badges.map((b) =>
                b.badges ? (
                  <BadgeChip
                    key={b.badge_id}
                    emoji={b.badges.emoji}
                    label={b.badges.label}
                  />
                ) : null,
              )}
            </div>
          )}
        </div>
      </section>

      {/* Séparateur cuivré */}
      <span
        aria-hidden
        className="mx-auto my-16 block h-px w-24 bg-copper opacity-50"
      />

      {/* ─────────────────────── SCÈNES EN COURS ─────────────────────── */}
      <section aria-labelledby="scenes-title">
        <SectionLabel id="scenes-title">Scènes en cours</SectionLabel>

        {ongoingScenes.length === 0 ? (
          <EmptyHint>Aucune scène en cours pour le moment.</EmptyHint>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ongoingScenes.map((s) => (
              <OngoingSceneCard key={s.id} scene={s} />
            ))}
          </div>
        )}
      </section>

      {/* Séparateur cuivré */}
      <span
        aria-hidden
        className="mx-auto my-16 block h-px w-24 bg-copper opacity-50"
      />

      {/* ─────────────────────── CALL-TO-ACTION ─────────────────────── */}
      {/* Le Codex et les Réglages sont désormais dans la sidebar — on ne
         garde ici que l'invitation principale « entrer dans le monde ». */}
      <section aria-labelledby="raccourcis-title">
        <SectionLabel id="raccourcis-title">Le pas suivant</SectionLabel>

        <div className="mt-6">
          <Link
            href="/monde"
            className="group inline-flex items-center gap-3 rounded-full bg-verdigris-deep px-7 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-paper shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-verdigris hover:shadow-[0_10px_28px_-14px_rgba(63,111,100,0.5)]"
          >
            Entrer dans le monde
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Sous-composants — locaux au dashboard.
   ───────────────────────────────────────────────────────────────────────── */

function SectionLabel({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted"
    >
      {children}
    </h2>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 font-serif text-sm italic text-muted">{children}</p>
  );
}

function XPBar({
  level,
  xp,
  threshold,
  pct,
}: {
  level: number;
  xp: number;
  threshold: number;
  pct: number;
}) {
  return (
    <div className="mt-8 max-w-md">
      <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        <span>Niveau {level}</span>
        <span>
          {xp} / {threshold} xp
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-verdigris transition-all duration-700"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

function DestinationTicket({ world }: { world: World }) {
  return (
    <div className="mt-10 inline-block max-w-full">
      <div
        className="relative rounded-md border border-dashed border-copper bg-paper/60 px-6 py-4 pr-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 8px, rgba(189,122,84,0.05) 8px 9px)",
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
          actuellement à
        </p>
        <p className="mt-1 font-display text-2xl font-medium text-ink">
          {world.name}
        </p>
        {world.tagline && (
          <p className="mt-1 font-serif text-sm italic text-muted">
            {world.tagline}
          </p>
        )}
        {/* Petite encoche façon billet poinçonné */}
        <span
          aria-hidden
          className="absolute right-0 top-1/2 -mr-1.5 -translate-y-1/2 h-3 w-3 rounded-full bg-paper border border-copper"
        />
      </div>
    </div>
  );
}

/**
 * Tampon du Carnet : petite vignette légèrement inclinée, palette dictée
 * par le `kind` (arrivée / visa / distinction). L'inclinaison alterne par
 * index pour un rendu plus organique.
 */
function StampVignette({ stamp, index }: { stamp: Stamp; index: number }) {
  const palette = STAMP_PALETTE[stamp.kind];

  const tilt = (index % 4) - 1.5; // -1.5deg → 2.5deg
  const style: CSSProperties = {
    transform: `rotate(${tilt}deg)`,
    backgroundColor: palette.bg,
    borderColor: palette.border,
    color: palette.ink,
  };

  return (
    <div
      className="select-none rounded-md border-2 px-4 py-3 shadow-[0_1px_0_rgba(67,52,45,0.05)] transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]"
      style={style}
    >
      <p
        className="font-mono text-[9px] uppercase tracking-[0.28em]"
        style={{ color: palette.border }}
      >
        {KIND_LABEL[stamp.kind]}
      </p>
      <p className="mt-1 font-display text-base font-medium leading-tight">
        {stamp.label}
      </p>
      {stamp.sublabel && (
        <p className="mt-0.5 font-serif text-xs italic opacity-80">
          {stamp.sublabel}
        </p>
      )}
      {stamp.occurred_label && (
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] opacity-70">
          {stamp.occurred_label}
        </p>
      )}
    </div>
  );
}

const STAMP_PALETTE: Record<
  Stamp["kind"],
  { bg: string; border: string; ink: string }
> = {
  arrivee: { bg: "#e9f0ed", border: "#3f6f64", ink: "#2c4f48" }, // verdigris
  visa: { bg: "#f6e5da", border: "#bd7a54", ink: "#7a4a30" }, // copper
  distinction: { bg: "#f6e2e4", border: "#cf9ea2", ink: "#7a4a4d" }, // rose
};

const KIND_LABEL: Record<Stamp["kind"], string> = {
  arrivee: "arrivée",
  visa: "visa",
  distinction: "distinction",
};

function BadgeChip({
  emoji,
  label,
}: {
  emoji: string | null;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-sm">
      {emoji && <span aria-hidden>{emoji}</span>}
      <span className="font-serif text-ink">{label}</span>
    </span>
  );
}

/**
 * Carte d'une scène en cours dans le Dashboard.
 * Cliquable → /monde/scene/[id]. Met en avant un « Reprendre → »
 * pour signaler clairement que l'action est de rejoindre la scène.
 */
function OngoingSceneCard({ scene }: { scene: OngoingScene }) {
  return (
    <Link
      href={`/monde/scene/${scene.id}`}
      className="group block rounded-xl border border-line bg-paper/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-verdigris hover:bg-paper hover:shadow-[0_8px_24px_-14px_rgba(63,111,100,0.35)]"
    >
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        <StatusDot status={scene.status} />
        <span>{scene.status}</span>
        {scene.locationName && (
          <>
            <span aria-hidden className="text-line">·</span>
            <span className="normal-case tracking-normal italic text-muted">
              au {scene.locationName}
            </span>
          </>
        )}
      </p>

      <h3 className="mt-2 font-display text-xl font-medium leading-tight text-ink transition-colors duration-300 group-hover:text-verdigris-deep">
        {scene.title}
      </h3>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {timeAgo(scene.updated_at)}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-verdigris-deep transition-transform duration-300 group-hover:translate-x-1">
          reprendre →
        </p>
      </div>
    </Link>
  );
}

function StatusDot({ status }: { status: OngoingScene["status"] }) {
  const color: Record<OngoingScene["status"], string> = {
    open: "bg-verdigris",
    active: "bg-copper",
    closed: "bg-muted",
    archived: "bg-line",
  };
  return (
    <span
      aria-hidden
      className={`inline-block h-1.5 w-1.5 rounded-full ${color[status]}`}
    />
  );
}

/* ───────────── Helpers ───────────── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d} j`;
  return new Date(iso).toLocaleDateString("fr-FR");
}
