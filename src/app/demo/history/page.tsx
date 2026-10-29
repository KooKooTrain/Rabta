import type { Metadata } from "next";

export const metadata: Metadata = { title: "History" };
export default function HistoryPage() {
  return <div className="mx-auto max-w-4xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12"><p className="text-sm text-muted">Past check-ins and family updates will appear here.</p><h2 className="mt-2 text-3xl font-medium tracking-[-0.045em]">History</h2><div className="mt-8 rounded-2xl border border-line bg-surface px-6 py-10 text-sm text-muted">No updates yet. Your family history will build here over time.</div></div>;
}
