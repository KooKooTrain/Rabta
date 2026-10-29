"use client";

import { useEffect, useRef, useState } from "react";
import { Undo2 } from "lucide-react";
import { gameById } from "@/config/games";
import { Pill } from "@/components/ui/Pill";
import { formatClock, seekerTeam, type MatchApi } from "@/lib/games/match";
import type { LiveMessage, LiveTrack, ReportEvent, TeamId } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { smallBtn } from "./parts";
import { judgeConfig } from "./TeamsStep";

type Call = { runId: string; event: ReportEvent; undone: boolean };

export type LiveJudge = {
  status: "off" | "paused" | "watching" | "error";
  frame: string | null;
  tracks: LiveTrack[];
  calls: Call[];
  error: string | null;
  undo: (id: string) => void;
};

const command = (cmd: string) =>
  fetch("/api/judge/live", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cmd }),
  }).catch(() => {});

/**
 * Runs the Python judge on the webcam for the whole match. Lives in PlayWizard so it outlives each round:
 * it starts on the round screen, pauses between rounds, and stops when the match ends, then loads the
 * signed report. Score events arrive already verified by the server and go straight onto the scoreboard.
 */
export function useLiveJudge(m: MatchApi): LiveJudge {
  const { state, liveEvent, loadReport, adjustScore } = m;
  const [live, setLive] = useState<Omit<LiveJudge, "undo">>({
    status: "off",
    frame: null,
    tracks: [],
    calls: [],
    error: null,
  });
  const running = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const onRound = state.step === "round";
  const playing = state.startedAt !== null;
  const blindfold = state.gameId ? gameById(state.gameId).mechanic === "blindfold" : false;

  useEffect(() => {
    if (!onRound) {
      if (running.current) void command("stop");
      return;
    }
    if (running.current) return;
    running.current = true;
    const ctrl = new AbortController();
    abort.current = ctrl;

    const handle = (msg: LiveMessage) => {
      if (msg.type === "tick") {
        setLive((s) => ({
          ...s,
          status: msg.paused ? "paused" : "watching",
          frame: msg.frame,
          tracks: msg.tracks ?? s.tracks,
          error: null,
        }));
      } else if (msg.type === "event") {
        liveEvent(msg.runId, msg.event);
        setLive((s) => ({ ...s, calls: [{ runId: msg.runId, event: msg.event, undone: false }, ...s.calls] }));
      } else if (msg.type === "report") {
        if (msg.result.status === "verified") loadReport(msg.result.payload);
        setLive((s) => ({ ...s, status: "off" }));
      } else {
        setLive((s) => ({ ...s, status: "error", error: msg.reason }));
      }
    };

    void (async () => {
      try {
        const res = await fetch("/api/judge/live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...judgeConfig(state), paused: !playing, seeker: seekerTeam(state) }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const body = (await res.json().catch(() => null)) as { reason?: string } | null;
          throw new Error(body?.reason ?? "I couldn't start the live judge.");
        }
        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let buf = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += value;
          let i;
          while ((i = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, i).trim();
            buf = buf.slice(i + 1);
            if (line) handle(JSON.parse(line) as LiveMessage);
          }
        }
      } catch (err) {
        if (!ctrl.signal.aborted) {
          const reason = err instanceof Error ? err.message : "The live judge stopped.";
          setLive((s) => ({ ...s, status: "error", error: reason }));
        }
      } finally {
        if (abort.current === ctrl) running.current = false;
      }
    })();
    // Only the step starts or stops the judge; the rest of the state is read once at start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRound]);

  // Leaving the page (or Strict Mode's test unmount) ends the session.
  useEffect(
    () => () => {
      abort.current?.abort();
      running.current = false;
    },
    [],
  );

  useEffect(() => {
    if (running.current) void command(playing ? "resume" : "pause");
  }, [playing]);

  useEffect(() => {
    if (running.current && blindfold) void command(`seeker ${seekerTeam(state)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.round, blindfold]);

  const undo = (id: string) => {
    const call = live.calls.find((c) => c.event.id === id && !c.undone);
    if (!call) return;
    for (const team of ["A", "B"] as TeamId[]) {
      const pts = call.event.score_change[team] ?? 0;
      if (pts) adjustScore(team, -pts);
    }
    setLive((s) => ({ ...s, calls: s.calls.map((c) => (c === call ? { ...c, undone: true } : c)) }));
  };

  return { ...live, undo };
}

const STATUS = {
  off: "Waking up the camera",
  paused: "Paused between rounds",
  watching: "Watching live",
  error: "Camera problem",
};

export function LivePanel({ m, live }: { m: MatchApi; live: LiveJudge }) {
  const { state } = m;
  const game = gameById(state.gameId);
  const nameOf = (t: LiveTrack) => {
    const player = state.players.find((p) => p.id === state.trackMap[String(t.track_id)]);
    return player?.name || `Player ${t.track_id}`;
  };
  const score = (t: LiveTrack) => (game.ball ? t.possession_ms : t.events);
  const leaders = live.tracks.filter((t) => t.team).slice(0, 3);

  return (
    <section aria-label="Live AI judge" className="flex flex-col gap-5 rounded-slab border border-line bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label-caps text-muted">[ Live AI judge ]</p>
        <Pill dot={live.status === "watching"}>{STATUS[live.status]}</Pill>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {live.frame ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/jpeg;base64,${live.frame}`}
            alt="What my judge sees right now"
            className="aspect-video w-full rounded-card border border-line bg-soft object-cover"
          />
        ) : (
          <div className="grid aspect-video place-items-center rounded-card border border-line bg-soft p-6 text-center text-muted">
            {live.status === "error" ? "No camera feed right now." : "I'm waking up the camera. This takes a few seconds."}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="label-caps text-muted">[ Live MVP ]</p>
            {leaders.length === 0 || score(leaders[0]) === 0 ? (
              <p className="text-sm text-muted">
                {game.ball ? "Once someone has the ball, I'll show who's running the game." : `I'll crown whoever gets the most ${game.scoreWord}s.`}
              </p>
            ) : (
              <ol className="flex flex-col gap-2">
                {leaders.map((t, i) => (
                  <li key={t.track_id} className={cn("flex items-center justify-between gap-3 rounded-tile border border-line p-3", i === 0 && "border-fg")}>
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-3 rounded-full" style={{ background: state.teams[t.team as TeamId].color }} />
                      <span className="font-medium">{i === 0 ? `MVP: ${nameOf(t)}` : nameOf(t)}</span>
                    </span>
                    <span className="text-sm text-muted tabular-nums">
                      {game.ball ? formatClock(t.possession_ms) : `${t.events} ${game.scoreWord}${t.events === 1 ? "" : "s"}`}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="flex flex-col gap-3" aria-live="polite">
            <p className="label-caps text-muted">[ My calls ]</p>
            {live.calls.length === 0 ? (
              <p className="text-sm text-muted">Every {game.scoreWord} I see goes straight on the scoreboard.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {live.calls.slice(0, 4).map(({ event, undone }) => (
                  <li key={event.id} className={cn("flex items-center justify-between gap-3 rounded-tile border border-line p-3", undone && "opacity-60")}>
                    <span className="text-sm">
                      <span className={cn("font-medium capitalize", undone && "line-through")}>
                        {game.scoreWord} for {state.teams[event.team].name}
                      </span>{" "}
                      <span className="text-muted">
                        · {formatClock(event.t_ms)} · {event.confidence}% sure
                      </span>
                    </span>
                    {!undone && (
                      <button type="button" className={smallBtn} onClick={() => live.undo(event.id)} aria-label={`Undo the ${game.scoreWord} for ${state.teams[event.team].name}`}>
                        <Undo2 aria-hidden="true" className="size-4" />
                        Undo
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {live.status === "error" && (
        <p role="alert" className="rounded-tile border border-line-strong p-4">
          {live.error} The scoreboard is back in your hands, so use the buttons above.
        </p>
      )}
    </section>
  );
}
