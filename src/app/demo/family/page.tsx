import type { Metadata } from "next";
import { Users } from "lucide-react";

export const metadata: Metadata = { title: "Family" };
export default function FamilyPage() {
  return <div className="mx-auto max-w-4xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12"><p className="text-sm text-muted">A shared space for the people who matter.</p><h2 className="mt-2 text-3xl font-medium tracking-[-0.045em]">Family</h2><div className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-8"><span className="grid size-11 place-items-center rounded-full bg-soft"><Users aria-hidden="true" className="size-5 text-muted" /></span><div><p className="font-medium">Your family space</p><p className="mt-1 text-sm text-muted">Add family members to start sharing updates and plans.</p></div></div></div>;
}
