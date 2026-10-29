"use client";

import { useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { gameById } from "@/config/games";
import { ActionButton } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { appliedEvents, formatClock, pendingEvents, type MatchApi } from "@/lib/games/match";
import type { VerifyResult } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { StepHeader, TeamName, field, smallBtn } from "./parts";
import { judgeConfig } from "./TeamsStep";

const fileUrl = (runId: string, file: string) => `/api/judge-files/${runId}/${file}`;

export function JudgeStep({ m }: { m: MatchApi }) {
  const { state } = m;
  const { report } = state;
  const game = gameById(state.gameId);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The server decides validity. I only load a payload it returned as verified.
  async function verify(raw: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reports/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      });
      const result = (await res.json()) as VerifyResult;
      if (result.status === "verified" && result.payload.game !== game.id) {
        setError(`That report is for ${gameById(result.payload.game).name}, but this match is ${game.name}.`);
      } else if (result.status === "verified") {
        m.loadReport(result.payload);
        setText("");
      } else if (result.status === "invalid") {
        setError(`Invalid signature: report rejected. ${result.reason}`);
      } else {
        setError(result.reason);
      }
    } catch {
      setError("I couldn't reach the verifier. Is npm run dev still running?");
    } finally {
      setBusy(false);
    }
  }

  // Upload a clip and let the server run the judge. The server verifies the signed report before replying.
  async function analyse(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("video", file);
      form.append("config", JSON.stringify(judgeConfig(state)));
      const result = (await (await fetch("/api/judge/run", { method: "POST", body: form })).json()) as VerifyResult;
      if (result.status === "verified") m.loadReport(result.payload);
      else setError(result.reason);
    } catch {
      setError("I couldn't reach the judge. Is npm run dev still running?");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (file) await verify(await file.text());
  }

  const pending = pendingEvents(state);
  const applied = appliedEvents(state);

  return (
    <div className="flex flex-col gap-10">
      <StepHeader
        label="AI judge"
        title="Check the footage"
        intro="Upload your match clip as an MP4 and my judge will go through it. I check the signed report on the server before anything touches the score."
      />

      <section className="flex flex-col gap-4 rounded-slab border border-line bg-surface p-6 md:p-8">
        <p className="label-caps text-muted">[ Upload match video ]</p>
        <input
          type="file"
          accept="video/mp4,.mp4"
          disabled={busy}
          aria-label="Upload match video (MP4)"
          onChange={(e) => {
            void analyse(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="text-sm file:me-3 file:rounded-pill file:border file:border-line-strong file:bg-bg file:px-3.5 file:py-1.5 file:text-fg"
        />
        {busy && (
          <p role="status" className="text-muted">
            Watching the footage. This takes about a minute for every 100 seconds of video.
          </p>
        )}
        <p className="text-sm text-muted">
          This judge is a stand-in. I&apos;ll swap it for a MediaPipe pipeline once all four sports are in.
        </p>
        <p className="label-caps mt-4 text-muted">[ Or import a report ]</p>
        <input
          type="file"
          accept="application/json,.json"
          disabled={busy}
          aria-label="Upload report.json"
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="text-sm file:me-3 file:rounded-pill file:border file:border-line-strong file:bg-bg file:px-3.5 file:py-1.5 file:text-fg"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Or paste the report JSON here"
          rows={4}
          className={cn(field, "h-auto py-2 font-mono text-sm")}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={smallBtn} disabled={busy || !text.trim()} onClick={() => void verify(text)}>
            {busy ? "Checking..." : "Verify pasted report"}
          </button>
        </div>
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-tile border border-line-strong p-4">
            <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <span>{error} The official score hasn&apos;t changed.</span>
          </p>
        )}
      </section>

      {report && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Pill className="border-transparent bg-accent text-accent-fg">
              <ShieldCheck aria-hidden="true" className="size-4" /> Verified report
            </Pill>
            <Pill>Run {report.run_id}</Pill>
            <Pill>
              AI proposes {report.proposed_score.A} : {report.proposed_score.B}
            </Pill>
            <Pill>
              Official {state.score.A} : {state.score.B}
            </Pill>
          </div>

          <section className="flex flex-col gap-4">
            <p className="label-caps text-muted">[ Every {game.scoreWord} I spotted ]</p>
            {report.events.length === 0 && (
              <p className="text-muted">I didn&apos;t see a {game.scoreWord} in this clip, so I&apos;m not proposing any score change.</p>
            )}
            <ul className="grid gap-4 md:grid-cols-2">
              {report.events.map((ev) => {
                const review = state.reviews[ev.id];
                const done = applied.some((a) => a.id === ev.id);
                return (
                  <li key={ev.id} className="flex flex-col gap-3 rounded-card border border-line p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fileUrl(report.run_id, ev.thumb)}
                      alt={`Frame of ${ev.id} at ${formatClock(ev.t_ms, true)}`}
                      className="aspect-video w-full rounded-tile border border-line bg-soft object-cover"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <TeamName team={state.teams[ev.team]} className="font-medium" />
                      <Pill>{formatClock(ev.t_ms, true)}</Pill>
                      <Pill>{ev.confidence}% sure</Pill>
                      {ev.needs_review && !review && <Pill dot>Needs your review</Pill>}
                      {review && <Pill>{review === "confirmed" ? "Confirmed" : "Rejected"}</Pill>}
                      {done && <Pill>Applied</Pill>}
                    </div>
                    <p className="text-sm text-muted">{ev.reason}</p>
                    {!done && (
                      <div className="flex gap-2">
                        <button type="button" className={smallBtn} onClick={() => m.review(ev.id, "confirmed")}>
                          Confirm
                        </button>
                        <button type="button" className={smallBtn} onClick={() => m.review(ev.id, "rejected")}>
                          Reject
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {report.annotated_video && (
            <section className="flex flex-col gap-4">
              <p className="label-caps text-muted">[ What I saw ]</p>
              <video
                controls
                preload="metadata"
                src={fileUrl(report.run_id, report.annotated_video)}
                className="w-full rounded-card border border-line bg-soft"
              />
            </section>
          )}

          <section className="flex flex-col gap-4">
            <p className="label-caps text-muted">[ Who is who ]</p>
            <p className="text-muted">
              My tracker numbers people, it doesn&apos;t know names. Match each track to a player so the stats and MVP
              use real names.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {report.tracks.map((t) => (
                <li key={t.track_id} className="flex flex-col gap-2 rounded-tile border border-line p-3">
                  <span className="text-sm">
                    Track {t.track_id}
                    {t.team ? ` · ${state.teams[t.team].name}` : ""}
                    {game.ball && ` · ${formatClock(t.possession_ms)} on the ball`}
                  </span>
                  <select
                    className={field}
                    value={state.trackMap[String(t.track_id)] ?? ""}
                    onChange={(e) => m.mapTrack(String(t.track_id), e.target.value)}
                    aria-label={`Player for track ${t.track_id}`}
                  >
                    <option value="">Not mapped</option>
                    {state.players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.id} ({state.teams[p.team].name})
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {report && (
          <ActionButton variant="secondary" disabled={pending.length === 0} onClick={m.applyAI}>
            {pending.length ? `Apply AI results (${pending.length})` : "Nothing new to apply"}
          </ActionButton>
        )}
        <ActionButton onClick={m.finish}>See results</ActionButton>
      </div>
    </div>
  );
}
