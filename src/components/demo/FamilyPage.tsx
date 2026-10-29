"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, ShieldCheck, Trash2, Users } from "lucide-react";
import { useWorkspacePreferences } from "@/components/demo/WorkspacePreferences";
import { cn } from "@/lib/utils";

type Relationship = "Parent" | "Child" | "Guest";
type FamilyMember = { id: string; name: string; relationship: Relationship; gameReady: boolean };

const STORAGE_KEY = "rabta-family-members.v1";
const SAMPLE_MEMBERS: FamilyMember[] = [
  { id: "sample-mariam", name: "Mariam", relationship: "Parent", gameReady: true },
  { id: "sample-omar", name: "Omar", relationship: "Parent", gameReady: true },
  { id: "sample-noor", name: "Noor", relationship: "Child", gameReady: true },
  { id: "sample-sami", name: "Sami", relationship: "Child", gameReady: false },
];

export function FamilyPage() {
  const { language } = useWorkspacePreferences();
  const ar = language === "ar";
  const [members, setMembers] = useState<FamilyMember[]>(SAMPLE_MEMBERS);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("Guest");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setMembers(JSON.parse(saved) as FamilyMember[]);
    } catch { /* use sample profiles if local storage is unavailable */ }
  }, []);

  const save = (next: FamilyMember[]) => {
    setMembers(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* keep changes for this session */ }
  };

  const addMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    save([...members, { id: `member-${Date.now()}`, name: trimmed, relationship, gameReady: true }]);
    setName("");
    setRelationship("Guest");
    setAdding(false);
  };

  const toggleGameReady = (member: FamilyMember) => save(members.map((item) => item.id === member.id ? { ...item, gameReady: !item.gameReady } : item));
  const removeMember = (id: string) => save(members.filter((member) => member.id !== id));
  const readyCount = members.filter((member) => member.gameReady).length;
  const hasSamples = members.some((member) => member.id.startsWith("sample-"));

  return (
    <div className="mx-auto max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12 lg:py-11">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label-caps text-muted">{ar ? "الأشخاص الذين يلعبون معًا" : "The people who play together"}</p>
          <h2 className="mt-2 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">{ar ? "العائلة" : "Family"}</h2>
          <p className="mt-3 max-w-2xl text-muted">{ar ? "أضف أفراد الأسرة وجهّزهم ليوم اللعب." : "Keep your household together and ready for game day."}</p>
        </div>
        <button type="button" onClick={() => setAdding((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85">
          <Plus aria-hidden="true" className="size-4" />{ar ? "إضافة فرد" : "Add member"}
        </button>
      </header>

      {hasSamples && <p className="mt-5 text-sm text-subtle">{ar ? "الأسماء المعروضة أمثلة توضيحية ويمكنك استبدالها." : "These are sample names. Add or remove people to set up your family on this device."}</p>}

      {adding && <form onSubmit={addMember} className="mt-7 grid gap-3 rounded-2xl bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-end sm:p-5">
        <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor="family-member-name">{ar ? "الاسم" : "Name"}<input id="family-member-name" autoFocus required maxLength={40} value={name} onChange={(event) => setName(event.target.value)} placeholder={ar ? "اسم الفرد" : "Family member name"} className="h-11 rounded-xl bg-bg px-3 font-normal outline-none ring-focus focus-visible:ring-2" /></label>
        <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor="family-member-role">{ar ? "صلة القرابة" : "Relationship"}<select id="family-member-role" value={relationship} onChange={(event) => setRelationship(event.target.value as Relationship)} className="h-11 rounded-xl bg-bg px-3 font-normal outline-none ring-focus focus-visible:ring-2"><option value="Parent">{ar ? "والد" : "Parent"}</option><option value="Child">{ar ? "طفل" : "Child"}</option><option value="Guest">{ar ? "ضيف" : "Guest"}</option></select></label>
        <button type="submit" className="h-11 rounded-full bg-brand px-5 text-sm font-medium text-fg hover:bg-brand-hover">{ar ? "حفظ الفرد" : "Save member"}</button>
      </form>}

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(19rem,0.72fr)] xl:gap-12">
        <section aria-labelledby="family-roster-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h3 id="family-roster-heading" className="text-xl font-medium tracking-[-0.03em]">{ar ? "أفراد الأسرة" : "Household"}</h3><p className="mt-1 text-sm text-muted">{members.length} {ar ? "أفراد" : members.length === 1 ? "person" : "people"}</p></div>
            <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex"><ShieldCheck aria-hidden="true" className="size-4" />{ar ? "محفوظ على هذا الجهاز" : "Saved on this device"}</span>
          </div>
          {members.length ? <ul className="grid gap-3 sm:grid-cols-2">
            {members.map((member, index) => <li key={member.id} className="family-member-card rounded-2xl bg-surface p-5 sm:p-6" style={{ animationDelay: `${index * 55}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-brand/25 text-lg font-medium text-brand-ink">{member.name.trim().slice(0, 1).toLocaleUpperCase()}</span>
                  <div className="min-w-0"><p className="truncate text-lg font-medium">{member.name}</p><p className="mt-0.5 text-sm text-muted">{ar ? ({ Parent: "والد", Child: "طفل", Guest: "ضيف" }[member.relationship]) : member.relationship}</p></div>
                </div>
                <button type="button" onClick={() => removeMember(member.id)} aria-label={`${ar ? "إزالة" : "Remove"} ${member.name}`} title={ar ? "إزالة" : "Remove"} className="grid size-9 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-fg/5 hover:text-fg"><Trash2 aria-hidden="true" className="size-4" /></button>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="text-sm text-muted">{ar ? "مستعد للعب" : "Ready for games"}</span>
                <button type="button" role="switch" aria-checked={member.gameReady} aria-label={`${ar ? "مستعد للعب" : "Game ready"}: ${member.name}`} onClick={() => toggleGameReady(member)} className={cn("relative h-6 w-11 rounded-full transition-colors", member.gameReady ? "bg-brand" : "bg-line-strong")}><span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform", member.gameReady ? "translate-x-[1.375rem]" : "translate-x-0.5")} /></button>
              </div>
            </li>)}
          </ul> : <div className="rounded-2xl bg-surface px-6 py-12 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-soft"><Users aria-hidden="true" className="size-5 text-muted" /></span><p className="mt-4 font-medium">{ar ? "أضف أول فرد من الأسرة" : "Start with your household"}</p><p className="mt-1 text-sm text-muted">{ar ? "أضف أفراد الأسرة للبدء." : "Add the people who will play together."}</p><button type="button" onClick={() => setAdding(true)} className="mt-4 text-sm font-medium text-accent-text hover:underline">{ar ? "إضافة فرد" : "Add a member"}</button></div>}
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-[1.75rem] bg-brand/20 p-6 sm:p-7">
            <p className="label-caps text-brand-ink">{ar ? "يوم اللعب" : "Game day"}</p>
            <h3 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.04em]">{ar ? "هل أنتم مستعدون للعب؟" : "Ready to play together?"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{ar ? "اختر لعبة، جهّز الفرق، واترك للمحكّم الذكي مراجعة الفيديو." : "Choose a game, split into teams and let the AI judge review the video."}</p>
            <div className="mt-6 flex items-end justify-between border-t border-fg/10 pt-4"><div><p className="text-3xl font-medium tabular-nums">{readyCount}</p><p className="mt-0.5 text-xs text-muted">{ar ? "مستعدون للعب" : "ready to play"}</p></div><Link href="/demo" className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-opacity hover:opacity-85">{ar ? "إعداد لعبة" : "Set up a game"}<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
          </section>
          <section className="rounded-2xl bg-surface p-5 sm:p-6">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-soft"><Users aria-hidden="true" className="size-4 text-muted" /></span><div><h3 className="font-medium">{ar ? "الفرق" : "Teams"}</h3><p className="mt-0.5 text-xs text-muted">{ar ? "تتغير حسب اللعبة" : "Choose teams for each game"}</p></div></div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{ar ? "قسّم أفراد الأسرة إلى فريقين من صفحة اللعبة. استخدم ألوان قمصان مختلفة ليسهل على المحكّم تمييز اللاعبين." : "Split the household into two teams in Game. Choose different shirt colours so the judge can tell players apart."}</p>
          </section>
          <Link href="/demo/history" className="inline-flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg"><span>{ar ? "عرض نتائج الألعاب السابقة" : "See previous game results"}</span><ArrowUpRight aria-hidden="true" className="size-4" /></Link>
        </aside>
      </div>
    </div>
  );
}
