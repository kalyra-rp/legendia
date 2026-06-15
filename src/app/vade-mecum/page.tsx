import type { Metadata } from "next";
import ComingSoon from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Le Vade-mecum — Legendia",
};

export default function VadeMecumPage() {
  return <ComingSoon title="Le Vade-mecum" eyebrow="Avant d'entrer" />;
}
