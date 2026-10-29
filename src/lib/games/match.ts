import { useEffect, useMemo, useReducer } from "react";
import { gameById, games } from "@/config/games";
import { saveGameHistory } from "./history";
import type {
  MatchState,
  Player,
  ReportEvent,
  ReportPayload,
  ReportTrack,
  Review,
  Rules,
  Step,
  Team,
  TeamId,
} from "./types";

const STORAGE_KEY = "bayt.match.v1";

const footballRules: Rules = games[0].defaultRules;

export const initialState: MatchState = {
  step: "game",
  gameId: null,
  teams: {
    A: { id: "A", name: "Team A", color: "#e53935" },
    B: { id: "B", name: "Team B", color: "#1e88e5" },
  },
  players: [
    { id: "p1", name: "", team: "A", ready: false },
    { id: "p2", name: "", team: "A", ready: false },
    { id: "p3", name: "", team: "B", ready: false },
    { id: "p4", name: "", team: "B", ready: false },
  ],
  rules: footballRules,
  round: 1,
  startedAt: null,
  elapsedMs: 0,
  score: { A: 0, B: 0 },
  report: null,
  reviews: {},
  trackMap: {},
  appliedEventIds: [],
  finishedAt: null,
  lastScorer: null,
  out: [],
};

export type Action =
  | { type: "hydrate"; state: MatchState }
  | { type: "selectGame"; gameId: string }
  | { type: "goto"; step: Step }
  | { type: "setTeam"; id: TeamId; patch: Partial<Omit<Team, "id">> }
  | { type: "setPlayers"; players: Player[] }
  | { type: "setRules"; patch: Partial<Rules> }
  | { type: "startRound"; now: number }
  | { type: "endRound"; now: number }
  | { type: "adjustScore"; team: TeamId; delta: number }
  | { type: "toggleOut"; playerId: string }
  | { type: "loadReport"; payload: ReportPayload }
  | { type: "review"; eventId: string; review: Review }
  | { type: "mapTrack"; trackId: string; playerId: string }
  | { type: "applyAI" }
  | { type: "finish"; now: number }
  | { type: "reset" };

/** Applied ids are scoped by run, so "goal-1" from a second report isn't mistaken for the first. */
export const appliedKey = (report: ReportPayload, ev: ReportEvent) => `${report.run_id}/${ev.id}`;

/** Report events that applyAI would add right now (not applied, not rejected, reviewed if flagged). */
export function pendingEvents(state: MatchState): ReportEvent[] {
  const { report, reviews, appliedEventIds } = state;
  if (!report) return [];
  return report.events.filter((ev) => {
    if (appliedEventIds.includes(appliedKey(report, ev))) return false;
    if (reviews[ev.id] === "rejected") return false;
    if (ev.needs_review && reviews[ev.id] !== "confirmed") return false;
    return true;
  });
}

export function appliedEvents(state: MatchState): ReportEvent[] {
  const { report } = state;
  if (!report) return [];
  return report.events.filter((ev) => state.appliedEventIds.includes(appliedKey(report, ev)));
}

export function reducer(state: MatchState, action: Action): MatchState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "selectGame": {
      const game = games.find((g) => g.id === action.gameId);
      if (!game || game.status !== "active") return state;
      return { ...state, gameId: game.id, rules: game.defaultRules, step: "teams", lastScorer: null, out: [] };
    }
    case "goto":
      return { ...state, step: action.step };
    case "setTeam":
      return {
        ...state,
        teams: { ...state.teams, [action.id]: { ...state.teams[action.id], ...action.patch } },
      };
    case "setPlayers":
      return { ...state, players: action.players };
    case "setRules":
      return { ...state, rules: { ...state.rules, ...action.patch } };
    case "startRound":
      return state.startedAt ? state : { ...state, startedAt: action.now };
    case "endRound": {
      // Bank playing time, capped at the round length (the clock stops at 00:00).
      const ran = state.startedAt
        ? Math.min(action.now - state.startedAt, state.rules.roundSeconds * 1000)
        : 0;
      const base = { ...state, startedAt: null, elapsedMs: state.elapsedMs + Math.max(0, ran), out: [] };
      return state.round < state.rules.rounds
        ? { ...base, round: state.round + 1 }
        : { ...base, step: "judge" };
    }
    case "adjustScore":
      return {
        ...state,
        score: {
          ...state.score,
          [action.team]: Math.max(0, state.score[action.team] + action.delta),
        },
        lastScorer: action.delta > 0 ? action.team : state.lastScorer,
      };
    case "toggleOut": {
      // Each elimination is a point for the other team; bringing a player back takes it away.
      const player = state.players.find((p) => p.id === action.playerId);
      if (!player) return state;
      const isOut = state.out.includes(player.id);
      const other: TeamId = player.team === "A" ? "B" : "A";
      return {
        ...state,
        out: isOut ? state.out.filter((id) => id !== player.id) : [...state.out, player.id],
        score: { ...state.score, [other]: Math.max(0, state.score[other] + (isOut ? -1 : 1)) },
      };
    }
    case "loadReport":
      return { ...state, report: action.payload, reviews: {}, trackMap: {} };
    case "review":
      return { ...state, reviews: { ...state.reviews, [action.eventId]: action.review } };
    case "mapTrack": {
      const trackMap = { ...state.trackMap };
      if (action.playerId) trackMap[action.trackId] = action.playerId;
      else delete trackMap[action.trackId];
      return { ...state, trackMap };
    }
    case "applyAI": {
      const { report } = state;
      const todo = pendingEvents(state);
      if (!report || todo.length === 0) return state; // idempotent
      const score = { ...state.score };
      for (const ev of todo) {
        score.A = Math.max(0, score.A + (ev.score_change.A ?? 0));
        score.B = Math.max(0, score.B + (ev.score_change.B ?? 0));
      }
      return {
        ...state,
        score,
        appliedEventIds: [...state.appliedEventIds, ...todo.map((ev) => appliedKey(report, ev))],
      };
    }
    case "finish":
      return { ...state, finishedAt: state.finishedAt ?? action.now, step: "results" };
    case "reset":
      return {
        ...initialState,
        teams: state.teams,
        players: state.players.map((p) => ({ ...p, ready: false })),
      };
  }
}

/* ── Pure read helpers ─────────────────────────────────────────────────────── */

export function elapsedMs(state: MatchState, now: number): number {
  return state.elapsedMs + (state.startedAt ? Math.max(0, now - state.startedAt) : 0);
}

export type PlayerPossession = {
  players: { player: Player; ms: number }[];
  unmapped: ReportTrack[];
};

/** Possession per player via the host's track mapping. Null when no report is loaded. */
export function playerPossession(state: MatchState): PlayerPossession | null {
  if (!state.report) return null;
  const byPlayer = new Map<string, number>();
  const unmapped: ReportTrack[] = [];
  for (const t of state.report.tracks) {
    const pid = state.trackMap[String(t.track_id)];
    const player = pid ? state.players.find((p) => p.id === pid) : undefined;
    if (player) byPlayer.set(player.id, (byPlayer.get(player.id) ?? 0) + t.possession_ms);
    else unmapped.push(t);
  }
  const players = state.players
    .filter((p) => byPlayer.has(p.id))
    .map((player) => ({ player, ms: byPlayer.get(player.id) ?? 0 }))
    .sort((a, b) => b.ms - a.ms);
  return { players, unmapped };
}

/**
 * Ball games: the player with the most possession time. Other games: the player credited with the
 * most applied events (eliminations, tags). Null if nobody is mapped or nobody earned it.
 */
export function mvp(state: MatchState): { player: Player; ms: number; events: number } | null {
  if (gameById(state.gameId).ball) {
    const top = playerPossession(state)?.players[0];
    return top && top.ms > 0 ? { ...top, events: 0 } : null;
  }
  const counts = new Map<string, number>();
  for (const ev of appliedEvents(state)) {
    const pid = ev.scorer_track === null ? undefined : state.trackMap[String(ev.scorer_track)];
    if (pid) counts.set(pid, (counts.get(pid) ?? 0) + 1);
  }
  const [pid, events] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? [];
  const player = state.players.find((p) => p.id === pid);
  return player && events ? { player, ms: 0, events } : null;
}

/** The team that hit the target with a big enough lead, or null if nobody has yet. */
export function targetWinner(state: MatchState): TeamId | null {
  const { target, winBy } = state.rules;
  if (!target) return null;
  const { A, B } = state.score;
  if (A >= target && A - B >= winBy) return "A";
  if (B >= target && B - A >= winBy) return "B";
  return null;
}

/**
 * Who restarts play. Football and basketball: the team that was just scored on.
 * Volleyball: the team that won the rally serves. Null before anyone scores.
 */
export function restartTeam(state: MatchState): TeamId | null {
  const last = state.lastScorer;
  if (!last) return null;
  return gameById(state.gameId).mechanic === "serve" ? last : last === "A" ? "B" : "A";
}

/** Al Ghomaidah: Team A wears the blindfold in odd rounds, Team B in even ones. */
export const seekerTeam = (state: MatchState): TeamId => (state.round % 2 === 1 ? "A" : "B");

/** A team with every player knocked out (Al Karabi), or null. */
export function teamAllOut(state: MatchState): TeamId | null {
  for (const id of ["A", "B"] as TeamId[]) {
    const team = state.players.filter((p) => p.team === id);
    if (team.length > 0 && team.every((p) => state.out.includes(p.id))) return id;
  }
  return null;
}

/** Team with the higher official score, or null for a draw. */
export function winner(state: MatchState): TeamId | null {
  const { A, B } = state.score;
  return A === B ? null : A > B ? "A" : "B";
}

/* ── Hook ──────────────────────────────────────────────────────────────────── */

function load(): MatchState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MatchState>;
    if (typeof parsed !== "object" || !parsed || typeof parsed.step !== "string") return null;
    // Merge rules too, so a match saved before rules gained new fields still loads.
    return { ...initialState, ...parsed, rules: { ...initialState.rules, ...parsed.rules } };
  } catch {
    return null;
  }
}

export function useMatch() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Save first, load second: the untouched initial state is never written, so a
  // saved match can't be clobbered on mount (including Strict Mode's double run).
  useEffect(() => {
    if (state === initialState) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked: the match still works in memory */
    }
  }, [state]);

  useEffect(() => {
    if (!state.finishedAt || !state.gameId) return;
    const game = gameById(state.gameId);
    const best = mvp(state);
    const report = state.report;
    saveGameHistory({
      id: `${game.id}-${state.finishedAt}`,
      gameId: game.id,
      gameName: game.name,
      completedAt: state.finishedAt,
      score: state.score,
      teams: state.teams,
      players: state.players.map(({ id, name, team }) => ({ id, name: name.trim() || id, team })),
      winner: winner(state),
      playedMs: state.elapsedMs,
      rules: {
        rounds: state.rules.rounds,
        roundSeconds: state.rules.roundSeconds,
        tieBreak: state.rules.tieBreak,
        pointsPerGoal: state.rules.pointsPerGoal,
        target: state.rules.target,
        winBy: state.rules.winBy,
      },
      mvp: best ? {
        name: best.player.name.trim() || best.player.id,
        team: best.player.team,
        detail: game.ball ? `${formatClock(best.ms)} on the ball` : `${best.events} ${game.scoreWord}${best.events === 1 ? "" : "s"}`,
      } : null,
      report: report ? {
        verified: true,
        sourceFile: report.source.file.split(/[\\/]/).pop() || report.source.file,
        durationMs: report.source.duration_ms,
        possessionMs: { A: report.possession_ms.A, B: report.possession_ms.B },
        events: report.events.map((event) => ({
          id: event.id,
          type: event.type,
          tMs: event.t_ms,
          team: event.team,
          confidence: event.confidence,
          reason: event.reason,
          status: state.appliedEventIds.includes(appliedKey(report, event))
            ? "applied" as const
            : state.reviews[event.id] === "rejected"
              ? "rejected" as const
              : event.needs_review && state.reviews[event.id] !== "confirmed"
                ? "needs-review" as const
                : "pending" as const,
        })),
      } : null,
    });
  }, [state]);

  useEffect(() => {
    const saved = load();
    if (saved) dispatch({ type: "hydrate", state: saved });
  }, []);

  const actions = useMemo(
    () => ({
      selectGame: (gameId: string) => dispatch({ type: "selectGame", gameId }),
      goto: (step: Step) => dispatch({ type: "goto", step }),
      setTeam: (id: TeamId, patch: Partial<Omit<Team, "id">>) =>
        dispatch({ type: "setTeam", id, patch }),
      setPlayers: (players: Player[]) => dispatch({ type: "setPlayers", players }),
      setRules: (patch: Partial<Rules>) => dispatch({ type: "setRules", patch }),
      startRound: () => dispatch({ type: "startRound", now: Date.now() }),
      endRound: () => dispatch({ type: "endRound", now: Date.now() }),
      adjustScore: (team: TeamId, delta: number) => dispatch({ type: "adjustScore", team, delta }),
      toggleOut: (playerId: string) => dispatch({ type: "toggleOut", playerId }),
      loadReport: (payload: ReportPayload) => dispatch({ type: "loadReport", payload }),
      review: (eventId: string, review: Review) => dispatch({ type: "review", eventId, review }),
      mapTrack: (trackId: string, playerId: string) =>
        dispatch({ type: "mapTrack", trackId, playerId }),
      applyAI: () => dispatch({ type: "applyAI" }),
      finish: () => dispatch({ type: "finish", now: Date.now() }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [],
  );

  return { state, ...actions };
}

export type MatchApi = ReturnType<typeof useMatch>;

/** mm:ss for clocks; mm:ss.t for event timestamps. */
export function formatClock(ms: number, tenths = false): string {
  const total = Math.max(0, ms);
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const base = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return tenths ? `${base}.${Math.floor((total % 1000) / 100)}` : base;
}
