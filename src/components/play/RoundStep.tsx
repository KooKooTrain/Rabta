import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { gameById } from "@/config/games";
import { guides } from "@/config/guides";
import { ActionButton } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import {
  formatClock,
  restartTeam,
  seekerTeam,
  targetWinner,
  teamAllOut,
  type MatchApi,
} from "@/lib/games/match";
import type { TeamId } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { LivePanel, type LiveJudge } from "./LiveJudge";
import { StepHeader, TeamName, smallBtn } from "./parts";

export function RoundStep({ m, judge }: { m: MatchApi; judge: LiveJudge }) {
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
  const game = gameById(state.gameId);
  const guide = guides[game.id];
  const tip = guide.tips[(state.round - 1) % guide.tips.length];
  const buttons = game.scoreButtons ?? [{ label: "", points: rules.pointsPerGoal }];
  const restart = restartTeam(state);
  const seeker = seekerTeam(state);
  const reached = targetWinner(state);
  const allOut = game.mechanic === "eliminations" ? teamAllOut(state) : null;
  const rallies = state.score.A + state.score.B;
  const callout = {
    kickoff: restart ? `Kick-off: ${state.teams[restart].name}` : "Kick-off: flip a coin",
    possession: restart ? `Ball: ${state.teams[restart].name}, from under the hoop` : "Ball: flip a coin",
    serve: restart ? `Serve: ${state.teams[restart].name}` : "First serve: flip a coin",
    eliminations: "Tap a player when they're out. The other team gets the point.",
    blindfold: `Blindfold on: ${state.teams[seeker].name}`,
  }[game.mechanic];

  return (
    <div className="flex flex-col gap-10">
      <StepHeader
        label={`Round ${state.round} of ${rules.rounds}`}
        title={live ? "Game on" : "Ready for the next round"}
        intro={`Point the laptop camera at the game and just play. My AI judge keeps the score live. If I get a ${game.scoreWord} wrong, tap Undo or use the host buttons.`}
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

        <div className="flex flex-wrap items-center justify-center gap-2" aria-live="polite">
          <Pill className="border-fg">{callout}</Pill>
          {game.mechanic === "serve" && rallies > 0 && rallies % 7 === 0 && <Pill dot>Switch sides</Pill>}
          {reached && (
            <Pill dot>
              {state.teams[reached].name} reached {rules.target}. That&apos;s the match.
            </Pill>
          )}
          {allOut && <Pill dot>{state.teams[allOut].name} are all out. Finish the round.</Pill>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(["A", "B"] as TeamId[]).map((id) => {
            const team = state.teams[id];
            // In Al Ghomaidah only the blindfolded team can score.
            const canScore = game.mechanic !== "blindfold" || id === seeker;
            return (
              <div
                key={id}
                className="flex flex-col items-center gap-4 rounded-card border border-line p-6"
              >
                <TeamName team={team} className="font-display text-title" />
                {game.mechanic === "blindfold" && (
                  <p className="text-sm text-muted">{id === seeker ? "Wearing the blindfold" : "Hiding"}</p>
                )}
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
                    {buttons.map((b) => (
                      <button
                        key={b.points}
                        type="button"
                        className={cn(smallBtn, !b.label && "w-11 px-0")}
                        onClick={() => m.adjustScore(id, b.points)}
                        disabled={!canScore}
                        aria-label={`Give ${team.name} ${b.points} point${b.points === 1 ? "" : "s"}`}
                      >
                        <Plus aria-hidden="true" className="size-4" />
                        {b.label && `${b.points} ${b.label}`}
                      </button>
                    ))}
                  </div>
                </div>
                {game.mechanic === "eliminations" && (
                  <ul className="flex flex-wrap justify-center gap-2" aria-label={`${team.name} players`}>
                    {state.players
                      .filter((p) => p.team === id)
                      .map((p) => {
                        const out = state.out.includes(p.id);
                        return (
                          <li key={p.id}>
                            <button
                              type="button"
                              aria-pressed={out}
                              className={cn(smallBtn, out && "line-through opacity-60")}
                              onClick={() => m.toggleOut(p.id)}
                            >
                              {p.name || p.id} {out ? "is out" : ""}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <LivePanel m={m} live={judge} />

      <aside className="flex max-w-3xl flex-col gap-2 rounded-card border border-line bg-soft p-5">
        <p className="label-caps text-muted">[ Tip for round {state.round} ]</p>
        <p>{tip}</p>
      </aside>

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
