import type { Metadata } from "next";
import { FamilyPage } from "@/components/demo/FamilyPage";

export const metadata: Metadata = { title: "Family" };
export default function FamilyRoute() {
  return <FamilyPage />;
}
