import type { Metadata } from "next";
import ComingSoon from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "L'Atlas — Legendia",
};

export default function AtlasPage() {
  return <ComingSoon numeral="I" title="L'Atlas" />;
}
