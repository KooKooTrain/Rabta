"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Check, Clock3, ShieldCheck, Trophy, Users } from "lucide-react";
import { gameById } from "@/config/games";
import { formatClock } from "@/lib/games/match";
import { readGameHistory, type GameHistoryRecord, type HistoryEvent } from "@/lib/games/history";
import { cn } from "@/lib/utils";

const EXAMPLE_RECORDS: GameHistoryRecord[] = [
  {
    id: "example-football", gameId: "football", gameName: "Football", completedAt: Date.UTC(2026, 9, 28, 17, 42),
    score: { A: 3, B: 2 },
    teams: { A: { id: "A", name: "Palm", color: "#e8a45b" }, B: { id: "B", name: "Dune", color: "#7598c3" } },
    players: [{ id: "p1", name: "Noor", team: "A" }, { id: "p2", name: "Sami", team: "A" }, { id: "p3", name: "Mariam", team: "B" }, { id: "p4", name: "Omar", team: "B" }],
    winner: "A", playedMs: 15 * 60_000,
    rules: { rounds: 2, roundSeconds: 450, tieBreak: "penalties", pointsPerGoal: 1, target: null, winBy: 1 },
    mvp: { name: "Noor", team: "A", detail: "4:12 on the ball" },
    report: { verified: true, sourceFile: "family-football.mp4", durationMs: 934_000, possessionMs: { A: 512_000, B: 365_000 }, events: [
      { id: "goal-1", type: "goal", tMs: 142_000, team: "A", confidence: 96, reason: "The ball crossed the right goal line after Noor's shot.", status: "applied" },
      { id: "goal-2", type: "goal", tMs: 386_000, team: "B", confidence: 88, reason: "The ball stayed inside the left goal zone for two frames.", status: "applied" },
      { id: "goal-3", type: "goal", tMs: 617_000, team: "A", confidence: 91, reason: "Sami's shot entered the goal while the ball was visible.", status: "applied" },
    ] },
  },
  {
    id: "example-basketball", gameId: "basketball", gameName: "Basketball", completedAt: Date.UTC(2026, 9, 25, 16, 10),
    score: { A: 12, B: 10 },
    teams: { A: { id: "A", name: "Comets", color: "#e8a45b" }, B: { id: "B", name: "Falcons", color: "#7598c3" } },
    players: [{ id: "p1", name: "Layla", team: "A" }, { id: "p2", name: "Rashid", team: "A" }, { id: "p3", name: "Hana", team: "B" }, { id: "p4", name: "Zayd", team: "B" }],
    winner: "A", playedMs: 18 * 60_000,
    rules: { rounds: 1, roundSeconds: 600, tieBreak: "golden-goal", pointsPerGoal: 1, target: 21, winBy: 1 },
    mvp: { name: "Layla", team: "A", detail: "5:03 on the ball" },
    report: { verified: true, sourceFile: "garden-basketball.mp4", durationMs: 1_086_000, possessionMs: { A: 603_000, B: 483_000 }, events: [
      { id: "basket-1", type: "basket", tMs: 278_000, team: "B", confidence: 94, reason: "Hana's team had last possession when the ball entered the hoop.", status: "applied" },
      { id: "basket-2", type: "basket", tMs: 704_000, team: "A", confidence: 89, reason: "The ball passed through the hoop while Layla's team held possession.", status: "applied" },
    ] },
  },
  {
    id: "example-karabi", gameId: "al-karabi", gameName: "Al Karabi", completedAt: Date.UTC(2026, 9, 22, 18, 5),
    score: { A: 4, B: 3 },
    teams: { A: { id: "A", name: "Palm", color: "#e8a45b" }, B: { id: "B", name: "Dune", color: "#7598c3" } },
    players: [{ id: "p1", name: "Mariam", team: "A" }, { id: "p2", name: "Omar", team: "A" }, { id: "p3", name: "Noor", team: "B" }, { id: "p4", name: "Sami", team: "B" }],
    winner: "A", playedMs: 6 * 60_000,
    rules: { rounds: 3, roundSeconds: 120, tieBreak: "draw", pointsPerGoal: 1, target: null, winBy: 1 },
    mvp: { name: "Mariam", team: "A", detail: "2 eliminations" },
    report: { verified: true, sourceFile: "al-karabi-rounds.mp4", durationMs: 390_000, possessionMs: { A: 0, B: 0 }, events: [
      { id: "elimination-1", type: "elimination", tMs: 118_000, team: "A", confidence: 92, reason: "Sami's foot touched the ground during the hop challenge.", status: "applied" },
      { id: "elimination-2", type: "elimination", tMs: 241_000, team: "B", confidence: 87, reason: "Noor stepped beyond the marked play area.", status: "applied" },
    ] },
  },
];

const dateLabel = (value: number) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
const dateTimeLabel = (value: number) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value));
const cap = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function HistoryPage() {
  const [records, setRecords] = useState(EXAMPLE_RECORDS);
  const [selectedId, setSelectedId] = useState(EXAMPLE_RECORDS[0].id);
  const [showingExamples, setShowingExamples] = useState(true);

  useEffect(() => {
    const sync = () => {
      const saved = readGameHistory().sort((a, b) => b.completedAt - a.completedAt);
      if (saved.length) {
        setRecords(saved);
        setSelectedId(saved[0].id);
        setShowingExamples(false);
      } else {
        setRecords(EXAMPLE_RECORDS);
        setSelectedId(EXAMPLE_RECORDS[0].id);
        setShowingExamples(true);
      }
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const selected = records.find((record) => record.id === selectedId) ?? records[0];
  return (
    <div className="mx-auto max-w-[90rem] px-5 py-8 sm:px-8 lg:px-12 lg:py-11">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7">
        <div>
          <p className="label-caps text-muted">Family game day</p>
          <h2 className="mt-2 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">History</h2>
          <p className="mt-3 max-w-2xl text-muted">Past games, final scores and what the AI judge saw.</p>
        </div>
        <div className="flex items-center gap-2 pb-1 text-sm text-muted">
          <CalendarDays aria-hidden="true" className="size-4" />
          <span>{records.length} {records.length === 1 ? "match" : "matches"}</span>
          {showingExamples && <span className="ms-1 rounded-full bg-soft px-2.5 py-1 text-xs">Sample data</span>}
        </div>
      </header>

      {showingExamples && <p className="mt-5 text-sm text-subtle">These examples preview the page. Your finished games will appear here automatically.</p>}

      <div className="mt-7 grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] xl:gap-12">
        <section aria-label="Previous games">
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="label-caps text-muted">Previous games</h3>
            <span className="text-xs tabular-nums text-subtle">{String(records.length).padStart(2, "0")}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {records.map((record) => {
              const active = record.id === selected?.id;
              return <button key={record.id} type="button" onClick={() => setSelectedId(record.id)} aria-pressed={active} className={cn("w-full rounded-2xl px-4 py-4 text-start transition-colors", active ? "bg-surface" : "hover:bg-fg/5")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{record.gameName}</p>
                    <p className="mt-1 text-xs text-muted">{dateLabel(record.completedAt)}</p>
                  </div>
                  <span className="shrink-0 text-lg font-medium tabular-nums">{record.score.A}–{record.score.B}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-subtle">
                  <span className="size-2 rounded-full" style={{ backgroundColor: record.teams.A.color }} />
                  <span className="truncate">{record.teams.A.name}</span>
                  <span aria-hidden="true">vs</span>
                  <span className="size-2 rounded-full" style={{ backgroundColor: record.teams.B.color }} />
                  <span className="truncate">{record.teams.B.name}</span>
                </div>
              </button>;
            })}
          </div>
          <Link href="/demo" className="mt-5 inline-flex items-center gap-2 px-1 text-sm font-medium text-accent-text hover:underline">
            Start another game <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </section>

        {selected && <MatchDetail record={selected} showingExamples={showingExamples} />}
      </div>
    </div>
  );
}

function MatchDetail({ record, showingExamples }: { record: GameHistoryRecord; showingExamples: boolean }) {
  const game = gameById(record.gameId);
  const winnerName = record.winner ? record.teams[record.winner].name : "Draw";
  const played = formatClock(record.playedMs);
  const possessionTotal = record.report ? record.report.possessionMs.A + record.report.possessionMs.B : 0;
  const possessionA = possessionTotal ? Math.round(record.report!.possessionMs.A / possessionTotal * 100) : 0;
  const possessionB = possessionTotal ? 100 - possessionA : 0;

  return <article className="min-w-0 rounded-[1.75rem] bg-surface p-5 sm:p-7 lg:p-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.13em] text-muted">
        <span>{game.group === "emirati" ? "Emirati heritage" : "Worldwide games"}</span><span aria-hidden="true">·</span><time dateTime={new Date(record.completedAt).toISOString()}>{dateTimeLabel(record.completedAt)}</time>
      </div>
      {showingExamples ? <span className="rounded-full bg-soft px-3 py-1.5 text-xs text-muted">Example result</span> : record.report?.verified ? <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-xs font-medium"><ShieldCheck aria-hidden="true" className="size-3.5" />Verified AI report</span> : <span className="rounded-full bg-soft px-3 py-1.5 text-xs text-muted">Host-scored result</span>}
    </div>

    <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-sm text-muted">Final result</p><h3 className="mt-1 text-2xl font-medium tracking-[-0.04em]">{record.gameName}</h3></div>
      <p className="inline-flex items-center gap-2 text-sm text-muted"><Trophy aria-hidden="true" className="size-4" />{winnerName} {record.winner ? "won" : "finished level"}</p>
    </div>

    <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-soft/70 px-4 py-5 sm:px-7 sm:py-6">
      <div className="min-w-0"><span className="mb-2 inline-block size-2.5 rounded-full" style={{ backgroundColor: record.teams.A.color }} /><p className="truncate font-medium">{record.teams.A.name}</p></div>
      <div className="flex items-center gap-1 text-4xl font-medium tabular-nums tracking-[-0.05em] sm:text-5xl">
        <span>{record.score.A}</span>
        <span aria-hidden="true" className="-translate-y-0.5 px-2 text-xl font-normal leading-none text-muted sm:-translate-y-1">–</span>
        <span>{record.score.B}</span>
      </div>
      <div className="min-w-0 text-end"><span className="mb-2 inline-block size-2.5 rounded-full" style={{ backgroundColor: record.teams.B.color }} /><p className="truncate font-medium">{record.teams.B.name}</p></div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <Metric icon={<Clock3 aria-hidden="true" className="size-4" />} label="Played" value={played} />
      <Metric icon={<Trophy aria-hidden="true" className="size-4" />} label="MVP" value={record.mvp?.name ?? "Not recorded"} note={record.mvp ? `${record.teams[record.mvp.team].name} · ${record.mvp.detail}` : undefined} />
      <Metric icon={<Users aria-hidden="true" className="size-4" />} label="Players" value={String(record.players.length)} note={`${record.rules.rounds} ${record.rules.rounds === 1 ? "round" : "rounds"}`} />
    </div>

    <div className="mt-8 grid gap-8 border-t border-line pt-7 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,0.78fr)]">
      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="text-lg font-medium">What the AI found</h4>
          <span className="text-xs text-muted">{record.report ? `${record.report.events.length} moments` : "No report"}</span>
        </div>
        {record.report ? <>
          <p className="mt-1 text-sm text-muted">Moments, confidence and the judge’s reason.</p>
          <ol className="mt-5 flex flex-col">
            {record.report.events.length ? record.report.events.map((event, index) => <EventRow key={event.id} event={event} record={record} last={index === record.report!.events.length - 1} />) : <li className="py-4 text-sm text-muted">The judge found no scoring moments in this match.</li>}
          </ol>
        </> : <p className="mt-2 text-sm text-muted">No AI report was attached. The host kept the official score.</p>}
      </section>

      <aside className="flex flex-col gap-6">
        <section>
          <h4 className="text-sm font-medium">Teams and players</h4>
          <div className="mt-3 flex flex-col gap-2">
            {(["A", "B"] as const).map((id) => <div key={id} className="rounded-xl bg-soft/60 px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-medium"><span className="size-2 rounded-full" style={{ backgroundColor: record.teams[id].color }} />{record.teams[id].name}</p>
              <p className="mt-1.5 pl-4 text-xs leading-relaxed text-muted">{record.players.filter((player) => player.team === id).map((player) => player.name).join(" · ") || "No player names saved"}</p>
            </div>)}
          </div>
        </section>
        <section>
          <h4 className="text-sm font-medium">Rules for this game</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted">{record.rules.rounds} {record.rules.rounds === 1 ? "round" : "rounds"} · {formatClock(record.rules.roundSeconds * 1000)} each · {record.rules.target ? `First to ${record.rules.target}` : `${record.rules.pointsPerGoal} ${game.scoreWord}${record.rules.pointsPerGoal === 1 ? "" : "s"} per event`} · {cap(record.rules.tieBreak)} tie-break</p>
        </section>
        {record.report && game.ball && possessionTotal > 0 && <section>
          <div className="flex items-center justify-between gap-3"><h4 className="text-sm font-medium">Possession</h4><span className="text-xs text-muted">AI video analysis</span></div>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-line"><span style={{ width: `${possessionA}%`, backgroundColor: record.teams.A.color }} /><span style={{ width: `${possessionB}%`, backgroundColor: record.teams.B.color }} /></div>
          <div className="mt-2 flex justify-between gap-3 text-xs text-muted"><span>{record.teams.A.name} · {possessionA}%</span><span>{record.teams.B.name} · {possessionB}%</span></div>
        </section>}
        {record.report && <p className="border-t border-line pt-4 text-xs leading-relaxed text-subtle">Source video: {record.report.sourceFile} · {formatClock(record.report.durationMs)}. The report is verified before its findings can update a score.</p>}
      </aside>
    </div>
  </article>;
}

function Metric({ icon, label, value, note }: { icon: ReactNode; label: string; value: string; note?: string }) {
  return <div className="rounded-xl bg-soft/45 px-4 py-3"><p className="flex items-center gap-2 text-xs text-muted">{icon}{label}</p><p className="mt-2 truncate text-lg font-medium">{value}</p>{note && <p className="mt-0.5 truncate text-xs text-muted">{note}</p>}</div>;
}

function EventRow({ event, record, last }: { event: HistoryEvent; record: GameHistoryRecord; last: boolean }) {
  const status = event.status === "applied" ? "Applied" : event.status === "rejected" ? "Not applied" : event.status === "needs-review" ? "Needs review" : "Pending";
  return <li className="relative flex gap-3 pb-5 last:pb-0">
    {!last && <span aria-hidden="true" className="absolute bottom-0 left-[0.45rem] top-5 w-px bg-line" />}
    <span className="relative mt-1 grid size-[0.95rem] shrink-0 place-items-center rounded-full bg-brand/20 text-accent-text">{event.status === "applied" ? <Check aria-hidden="true" className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}</span>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium">{cap(event.type)} · {record.teams[event.team].name}</span><span className="text-xs text-muted">{formatClock(event.tMs, true)}</span><span className="rounded-full bg-soft px-2 py-0.5 text-[0.6875rem] text-muted">{status}</span></div>
      <p className="mt-1 text-sm leading-relaxed text-muted">{event.reason}</p>
      <p className="mt-1 text-xs text-subtle">Judge confidence {event.confidence}%</p>
    </div>
  </li>;
}
