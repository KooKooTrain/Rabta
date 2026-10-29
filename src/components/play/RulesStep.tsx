import { Download } from "lucide-react";
import { gameById } from "@/config/games";
import { guides } from "@/config/guides";
import { ActionButton } from "@/components/ui/Button";
import type { MatchApi } from "@/lib/games/match";
import type { TieBreak } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { StepHeader, Swatch, field, smallBtn } from "./parts";
import { downloadJudgeConfig } from "./TeamsStep";

const TIE_BREAKS: { id: TieBreak; label: string; note: string }[] = [
  {
    id: "draw",
    label: "Draw stands",
    note: "Level scores at the end means everyone shares the result.",
  },
  {
    id: "golden-goal",
    label: "Golden point",
    note: "Play on, and the next score wins it.",
  },
  {
    id: "penalties",
    label: "Shootout",
    note: "Each team takes turns trying to score until one misses.",
  },
];

export const tieBreakNote = (t: TieBreak) => TIE_BREAKS.find((x) => x.id === t)!;

const LENGTHS = [60, 120, 180, 300, 600, 900];
const TARGETS = [0, 11, 15, 21];

export function RulesStep({ m }: { m: MatchApi }) {
  const { state } = m;
  const { rules, players } = state;
  const allReady = players.length > 0 && players.every((p) => p.ready);
  const setReady = (id: string, ready: boolean) =>
    m.setPlayers(players.map((p) => (p.id === id ? { ...p, ready } : p)));
  const tb = tieBreakNote(rules.tieBreak);
  const game = gameById(state.gameId);
  const word = game.scoreWord;
  const real = rules.mode === "real";

  return (
    <div className="flex flex-col gap-10">
      <StepHeader
        label="Step 3"
        title={real ? `${game.name} rules` : "House rules"}
        intro="Play it the way the sport is really played, or switch to house rules and change anything you like."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="flex flex-col gap-8 rounded-card border border-line bg-surface p-6 md:p-7">
          <div role="radiogroup" aria-label="Rule set" className="flex flex-wrap gap-2">
            {(["real", "house"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={rules.mode === mode}
                className={cn(smallBtn, rules.mode === mode && "border-fg bg-fg text-bg")}
                onClick={() => m.setRules(mode === "real" ? game.defaultRules : { mode })}
              >
                {mode === "real" ? "Real rules" : "House rules"}
              </button>
            ))}
          </div>

          {real ? (
            <ul className="flex flex-col gap-3">
              {guides[game.id].realRules.map((r) => (
                <li key={r.rule} className="flex flex-col gap-0.5 rounded-tile border border-line p-4">
                  <span className="font-medium">{r.rule}</span>
                  <span className="text-sm text-muted">{r.why}</span>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="ppg" className="label-caps text-muted">
                    [ Points per {word} ]
                  </label>
                  <input
                    id="ppg"
                    type="number"
                    min={1}
                    max={10}
                    className={field}
                    value={rules.pointsPerGoal}
                    onChange={(e) =>
                      m.setRules({
                        pointsPerGoal: Math.min(10, Math.max(1, Math.round(Number(e.target.value)) || 1)),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="len" className="label-caps text-muted">
                    [ Round length ]
                  </label>
                  <select
                    id="len"
                    className={field}
                    value={rules.roundSeconds}
                    onChange={(e) => m.setRules({ roundSeconds: Number(e.target.value) })}
                  >
                    {LENGTHS.map((s) => (
                      <option key={s} value={s}>
                        {s / 60} min
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="rounds" className="label-caps text-muted">
                    [ Rounds ]
                  </label>
                  <select
                    id="rounds"
                    className={field}
                    value={rules.rounds}
                    onChange={(e) => m.setRules({ rounds: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="target" className="label-caps text-muted">
                    [ First to ]
                  </label>
                  <select
                    id="target"
                    className={field}
                    value={rules.target ?? 0}
                    onChange={(e) => m.setRules({ target: Number(e.target.value) || null })}
                  >
                    {TARGETS.map((n) => (
                      <option key={n} value={n}>
                        {n ? `${n} points` : "No target, play the clock"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="winby" className="label-caps text-muted">
                    [ Win by ]
                  </label>
                  <select
                    id="winby"
                    className={field}
                    value={rules.winBy}
                    disabled={!rules.target}
                    onChange={(e) => m.setRules({ winBy: Number(e.target.value) })}
                  >
                    <option value={1}>1 point</option>
                    <option value={2}>2 points</option>
                  </select>
                </div>
              </div>

              <fieldset className="flex flex-col gap-3">
                <legend className="label-caps mb-2 text-muted">[ If it&apos;s a tie ]</legend>
                {TIE_BREAKS.map((t) => (
                  <label
                    key={t.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-tile border p-4 transition-colors",
                      rules.tieBreak === t.id ? "border-fg" : "border-line hover:border-line-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name="tiebreak"
                      className="mt-1 accent-[var(--color-accent)]"
                      checked={rules.tieBreak === t.id}
                      onChange={() => m.setRules({ tieBreak: t.id })}
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">{t.label}</span>
                      <span className="text-sm text-muted">{t.note}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            </>
          )}

          <fieldset className="flex flex-col gap-3">
            <legend className="label-caps mb-2 text-muted">[ Who&apos;s ready? ]</legend>
            <label className="flex items-center gap-3 font-medium">
              <input
                type="checkbox"
                className="size-4 accent-[var(--color-accent)]"
                checked={allReady}
                onChange={(e) => m.setPlayers(players.map((p) => ({ ...p, ready: e.target.checked })))}
              />
              Everyone&apos;s ready
            </label>
            <ul className="grid gap-2 sm:grid-cols-2">
              {players.map((p) => (
                <li key={p.id}>
                  <label className="flex items-center gap-3 rounded-inner border border-line px-3 py-2.5">
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--color-accent)]"
                      checked={p.ready}
                      onChange={(e) => setReady(p.id, e.target.checked)}
                    />
                    <Swatch color={state.teams[p.team].color} />
                    {p.name}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>

        <aside className="flex h-fit flex-col gap-5 rounded-card border border-line bg-soft p-6 md:p-7">
          <p className="label-caps text-muted">[ Match summary ]</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted">Teams</dt>
            <dd>
              {state.teams.A.name} v {state.teams.B.name}
            </dd>
            <dt className="text-muted">Scoring</dt>
            <dd>
              {rules.pointsPerGoal} point{rules.pointsPerGoal === 1 ? "" : "s"} per {word}
            </dd>
            <dt className="text-muted">Clock</dt>
            <dd>
              {rules.rounds} round{rules.rounds === 1 ? "" : "s"} of {rules.roundSeconds / 60} min
            </dd>
            {rules.target && (
              <>
                <dt className="text-muted">Target</dt>
                <dd>
                  First to {rules.target}
                  {rules.winBy > 1 ? `, win by ${rules.winBy}` : ""}
                </dd>
              </>
            )}
            <dt className="text-muted">Tie-break</dt>
            <dd>{tb.label}</dd>
          </dl>
          <p className="text-sm text-muted">
            Changed the scoring? Download the judge config again so my judge uses the same rules.
          </p>
          <button type="button" className={cn(smallBtn, "self-start")} onClick={() => downloadJudgeConfig(state)}>
            <Download aria-hidden="true" className="size-4" />
            Download judge config
          </button>
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ActionButton
          size="lg"
          disabled={!allReady}
          onClick={() => {
            m.startRound();
            m.goto("round");
          }}
        >
          Start match
        </ActionButton>
        {!allReady && <p className="text-sm text-muted">Tick everyone as ready to start.</p>}
      </div>
    </div>
  );
}
