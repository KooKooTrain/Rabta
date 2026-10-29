"use client";

import { gameById } from "@/config/games";
import { ActionButton } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Donut } from "@/components/visuals/Donut";
import { appliedEvents, formatClock, mvp, playerPossession, winner, type MatchApi } from "@/lib/games/match";
import type { TeamId } from "@/lib/games/types";
import { StepHeader, Swatch, TeamName } from "./parts";

const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

export function ResultsStep({ m }: { m: MatchApi }) {
  const { state } = m;
  const { report } = state;
  const game = gameById(state.gameId);
  const win = winner(state);
  const best = mvp(state);
  const possession = playerPossession(state);
  const goals = appliedEvents(state);
  const teamMs = report ? report.possession_ms.A + report.possession_ms.B : 0;

  return (
    <div className="flex flex-col gap-10">
      <StepHeader
        label="Results"
        title={win ? `${state.teams[win].name} win` : "It's a draw"}
        intro={
          win
            ? `Here's how the match went. The score is the official one you kept, plus every AI ${game.scoreWord} you approved.`
            : `Level on points. Your tie break is ${state.rules.tieBreak.replace("-", " ")}.`
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2 rounded-card border border-line p-5">
          <p className="label-caps text-muted">[ Final score ]</p>
          <p className="font-display text-display-md tabular-nums">
            {state.score.A} : {state.score.B}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-card border border-line p-5">
          <p className="label-caps text-muted">[ Played ]</p>
          <p className="font-display text-display-md tabular-nums">{formatClock(state.elapsedMs)}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-card border border-line p-5">
          <p className="label-caps text-muted">[ AI {game.scoreWord}s applied ]</p>
          <p className="font-display text-display-md tabular-nums">{goals.length}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-card border border-line p-5">
          <p className="label-caps text-muted">[ MVP ]</p>
          <p className="font-display text-display-md">{best ? best.player.name || best.player.id : "None yet"}</p>
          {best && (
            <p className="text-sm text-muted">
              {game.ball ? `${formatClock(best.ms)} on the ball` : `${best.events} ${game.scoreWord}${best.events === 1 ? "" : "s"}`}
            </p>
          )}
        </div>
      </section>

      {report && game.ball ? (
        <section className="grid gap-8 rounded-slab border border-line bg-surface p-6 md:grid-cols-[14rem_1fr] md:p-8">
          <Donut
            label="Possession by team"
            className="size-56"
            segments={(["A", "B"] as TeamId[]).map((id) => ({
              value: report.possession_ms[id],
              color: state.teams[id].color,
              label: state.teams[id].name,
            }))}
          />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="label-caps text-muted">[ Possession by team ]</p>
              {(["A", "B"] as TeamId[]).map((id) => (
                <p key={id} className="flex items-center justify-between gap-4">
                  <TeamName team={state.teams[id]} />
                  <span className="tabular-nums">{pct(report.possession_ms[id], teamMs)}%</span>
                </p>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="label-caps text-muted">[ Possession by player ]</p>
              {possession && possession.players.length > 0 ? (
                possession.players.map(({ player, ms }) => (
                  <p key={player.id} className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2">
                      <Swatch color={state.teams[player.team].color} />
                      {player.name || player.id}
                    </span>
                    <span className="tabular-nums">{pct(ms, teamMs)}%</span>
                  </p>
                ))
              ) : (
                <p className="text-muted">Map the tracks to players on the judge screen to see this.</p>
              )}
              {possession && possession.unmapped.length > 0 && (
                <Pill className="self-start">{possession.unmapped.length} tracks not mapped</Pill>
              )}
            </div>
          </div>
        </section>
      ) : (
        <p className="text-muted">
          {report
            ? `${game.name} has no ball to track, so I pick the MVP by ${game.scoreWord}s instead of possession.`
            : "No AI report was loaded, so I don't have stats for this match."}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <ActionButton variant="secondary" onClick={() => m.goto("judge")}>
          Back to the judge
        </ActionButton>
        <ActionButton onClick={m.reset}>New game day</ActionButton>
      </div>
    </div>
  );
}
