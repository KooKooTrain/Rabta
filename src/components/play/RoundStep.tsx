import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { gameById } from "@/config/games";
import { ActionButton } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { formatClock, type MatchApi } from "@/lib/games/match";
import type { TeamId } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { StepHeader, TeamName, smallBtn } from "./parts";

export function RoundStep({ m }: { m: MatchApi }) {
  const { state } = m;
  const { startedAt, rules } = state;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (startedAt === null) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [startedAt]);

  const live = startedAt !== null;
  const remaining = live ? rules.roundSeconds * 1000 - (now - startedAt) : rules.roundSeconds * 1000;
  const timesUp = live && remaining <= 0;
  const last = state.round >= rules.rounds;

  return (
    <div className="flex flex-col gap-10">
      <StepHeader
        label={`Round ${state.round} of ${rules.rounds}`}
        title={live ? "Game on" : "Ready for the next round"}
        intro={`Record the match on a phone. You keep the official score here, and my judge can check every ${gameById(state.gameId).scoreWord} from the clip afterwards.`}
      />

      <section
        aria-label="Scoreboard"
        className="flex flex-col gap-8 rounded-slab border border-line bg-surface p-6 md:p-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Pill dot={live && !timesUp}>
            {live ? (timesUp ? "Time's up" : "Live") : "Paused"}
          </Pill>
          <p className="label-caps text-muted">
            [ Round {state.round} of {rules.rounds} ]
          </p>
        </div>

        <div className="flex flex-col items-center gap-1" role="timer" aria-live="off">
          <p className={cn("font-display text-display-xl tabular-nums", timesUp && "text-muted")}>
            {formatClock(remaining)}
          </p>
          {timesUp && <p className="text-lead">Time&apos;s up. Finish the round when you&apos;re ready.</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(["A", "B"] as TeamId[]).map((id) => {
            const team = state.teams[id];
            return (
              <div
                key={id}
                className="flex flex-col items-center gap-4 rounded-card border border-line p-6"
              >
                <TeamName team={team} className="font-display text-title" />
                <p className="font-display text-stat tabular-nums" aria-live="polite">
                  {state.score[id]}
                </p>
                <div className="flex flex-col items-center gap-2">
                  <p className="label-caps text-muted">[ Host controls ]</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={cn(smallBtn, "w-11 px-0")}
                      onClick={() => m.adjustScore(id, -1)}
                      disabled={state.score[id] === 0}
                      aria-label={`Take a point from ${team.name}`}
                    >
                      <Minus aria-hidden="true" className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={cn(smallBtn, "w-11 px-0")}
                      onClick={() => m.adjustScore(id, 1)}
                      aria-label={`Give ${team.name} a point`}
                    >
                      <Plus aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        {live ? (
          <ActionButton size="lg" onClick={m.endRound}>
            {last ? "Finish match" : "Finish round"}
          </ActionButton>
        ) : (
          <ActionButton
            size="lg"
            onClick={() => {
              setNow(Date.now());
              m.startRound();
            }}
          >
            Start round {state.round}
          </ActionButton>
        )}
        {live && last && (
          <p className="text-sm text-muted">This is the last round. Next up: my AI judge checks the clip.</p>
        )}
      </div>
    </div>
  );
}
