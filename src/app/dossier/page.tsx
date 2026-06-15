import type { Metadata } from "next";
import ComingSoon from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Le Dossier — Legendia",
};

export default function DossierPage() {
  return <ComingSoon numeral="III" title="Le Dossier" />;
}
