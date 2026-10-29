import type { Metadata } from "next";
import { HistoryPage } from "@/components/demo/HistoryPage";

export const metadata: Metadata = { title: "History" };

export default function HistoryRoute() {
  return <HistoryPage />;
}
