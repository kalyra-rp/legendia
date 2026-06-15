import type { Metadata } from "next";
import ComingSoon from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Le Registre — Legendia",
};

export default function RegistrePage() {
  return <ComingSoon numeral="II" title="Le Registre" />;
}
