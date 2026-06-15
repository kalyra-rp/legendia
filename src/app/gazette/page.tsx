import type { Metadata } from "next";
import ComingSoon from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "La Gazette de Savannah — Legendia",
};

export default function GazettePage() {
  return <ComingSoon numeral="III" title="La Gazette de Savannah" />;
}
