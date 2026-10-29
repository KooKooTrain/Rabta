import { Download, Plus, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/ui/Button";
import type { MatchApi } from "@/lib/games/match";
import type { MatchState, Player, TeamId } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { StepHeader, field, smallBtn } from "./parts";

const PRESETS = [
  { name: "Red", hex: "#e53935" },
  { name: "Blue", hex: "#1e88e5" },
  { name: "Yellow", hex: "#fdd835" },
  { name: "Green", hex: "#43a047" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#111111" },
  { name: "Orange", hex: "#fb8c00" },
  { name: "Purple", hex: "#8e24aa" },
];

export function teamProblems(state: MatchState): string[] {
  const out: string[] = [];
  const names = state.players.map((p) => p.name.trim().toLowerCase());
  if (names.some((n) => !n)) out.push("Every player needs a name.");
  if (new Set(names.filter(Boolean)).size !== names.filter(Boolean).length)
    out.push("Two players share a name. Add an initial so I can tell them apart.");
  for (const id of ["A", "B"] as TeamId[])
    if (!state.players.some((p) => p.team === id))
      out.push(`${state.teams[id].name || `Team ${id}`} needs at least one player.`);
  if (state.teams.A.color.toLowerCase() === state.teams.B.color.toLowerCase())
    out.push("Pick different colours so I can tell the teams apart on camera.");
  if (!state.teams.A.name.trim() || !state.teams.B.name.trim()) out.push("Both teams need a name.");
  return out;
}

export function judgeConfig(state: MatchState) {
  return {
    teams: [state.teams.A, state.teams.B],
    players: state.players.map(({ id, name, team }) => ({ id, name: name.trim(), team })),
    rules: state.rules,
  };
}

/** Saves match.json for `judge.py --config`. */
export function downloadJudgeConfig(state: MatchState) {
  const blob = new Blob([JSON.stringify(judgeConfig(state), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "match.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function TeamsStep({ m }: { m: MatchApi }) {
  const { state } = m;
  const problems = teamProblems(state);
  const counts = { A: 0, B: 0 };
  for (const p of state.players) counts[p.team]++;
  const not2v2 = counts.A !== 2 || counts.B !== 2;

  const update = (id: string, patch: Partial<Player>) =>
    m.setPlayers(state.players.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addPlayer = (team: TeamId) => {
    const n = Math.max(0, ...state.players.map((p) => Number(p.id.slice(1)) || 0)) + 1;
    m.setPlayers([...state.players, { id: `p${n}`, name: "", team, ready: false }]);
  };

  const download = () => downloadJudgeConfig(state);

  return (
    <div className="flex flex-col gap-10">
      <StepHeader
        label="Step 2"
        title="Players and teams"
        intro="Name everyone and give each team a clear shirt colour. I use the colours to tell the teams apart in the video."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {(["A", "B"] as TeamId[]).map((id) => {
          const team = state.teams[id];
          const players = state.players.filter((p) => p.team === id);
          return (
            <section
              key={id}
              aria-label={`${team.name || `Team ${id}`} setup`}
              className="flex flex-col gap-6 rounded-card border border-line bg-surface p-6 md:p-7"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor={`team-${id}-name`} className="label-caps text-muted">
                  [ Team {id} name ]
                </label>
                <input
                  id={`team-${id}-name`}
                  className={cn(field, "font-display text-title h-14")}
                  value={team.name}
                  onChange={(e) => m.setTeam(id, { name: e.target.value })}
                />
              </div>

              <fieldset className="flex flex-col gap-3">
                <legend className="label-caps mb-2 text-muted">[ Shirt colour ]</legend>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESETS.map((c) => {
                    const on = team.color.toLowerCase() === c.hex;
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        aria-label={c.name}
                        aria-pressed={on}
                        onClick={() => m.setTeam(id, { color: c.hex })}
                        className={cn(
                          "size-9 rounded-full border border-line-strong transition-transform hover:scale-110",
                          on && "ring-2 ring-fg ring-offset-2 ring-offset-surface",
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                  <label className="ms-1 inline-flex items-center gap-2 text-sm text-muted">
                    <input
                      type="color"
                      value={team.color}
                      onChange={(e) => m.setTeam(id, { color: e.target.value })}
                      className="size-9 cursor-pointer rounded-full border border-line-strong bg-transparent"
                    />
                    Custom
                  </label>
                </div>
              </fieldset>

              <div className="flex flex-col gap-3">
                <p className="label-caps text-muted">[ Players ]</p>
                {players.length === 0 && (
                  <p className="text-sm text-muted">No players yet. Add one or move someone across.</p>
                )}
                <ul className="flex flex-col gap-2">
                  {players.map((p) => (
                    <li key={p.id} className="flex items-center gap-2">
                      <label htmlFor={`name-${p.id}`} className="sr-only">
                        Player name
                      </label>
                      <input
                        id={`name-${p.id}`}
                        className={field}
                        placeholder="Player name"
                        value={p.name}
                        onChange={(e) => update(p.id, { name: e.target.value })}
                      />
                      <button
                        type="button"
                        className={smallBtn}
                        onClick={() => update(p.id, { team: id === "A" ? "B" : "A" })}
                        aria-label={`Move ${p.name || "player"} to Team ${id === "A" ? "B" : "A"}`}
                      >
                        To {id === "A" ? "B" : "A"}
                      </button>
                      <button
                        type="button"
                        className={cn(smallBtn, "w-9 px-0")}
                        onClick={() => m.setPlayers(state.players.filter((x) => x.id !== p.id))}
                        aria-label={`Remove ${p.name || "player"}`}
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" className={cn(smallBtn, "self-start")} onClick={() => addPlayer(id)}>
                  <Plus aria-hidden="true" className="size-4" />
                  Add player
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-col gap-4" aria-live="polite">
        {not2v2 && (
          <p className="text-sm text-muted">
            Teams are {counts.A} v {counts.B}. That&apos;s fine, though 2 per team works best for the demo.
          </p>
        )}
        {problems.length > 0 && (
          <ul className="flex flex-col gap-1 rounded-tile border border-line-strong p-4 text-sm">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ActionButton disabled={problems.length > 0} onClick={() => m.goto("rules")}>
          Save teams
        </ActionButton>
        <button type="button" className={cn(smallBtn, "h-11 px-5")} disabled={problems.length > 0} onClick={download}>
          <Download aria-hidden="true" className="size-4" />
          Download judge config
        </button>
      </div>
    </div>
  );
}
