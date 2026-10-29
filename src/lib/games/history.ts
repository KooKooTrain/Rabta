import type { GameId, Team, TeamId, TieBreak } from "./types";

export type HistoryEvent = {
  id: string;
  type: string;
  tMs: number;
  team: TeamId;
  confidence: number;
  reason: string;
  status: "applied" | "rejected" | "needs-review" | "pending";
};

export type GameHistoryRecord = {
  id: string;
  gameId: GameId;
  gameName: string;
  completedAt: number;
  score: Record<TeamId, number>;
  teams: Record<TeamId, Team>;
  players: { id: string; name: string; team: TeamId }[];
  winner: TeamId | null;
  playedMs: number;
  rules: { rounds: number; roundSeconds: number; tieBreak: TieBreak; pointsPerGoal: number; target: number | null; winBy: number };
  mvp: { name: string; team: TeamId; detail: string } | null;
  report: {
    verified: true;
    sourceFile: string;
    durationMs: number;
    possessionMs: Record<TeamId, number>;
    events: HistoryEvent[];
  } | null;
};

const STORAGE_KEY = "rabta.match-history.v1";

export function readGameHistory(): GameHistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const records = JSON.parse(raw) as unknown;
    if (!Array.isArray(records)) return [];
    return records.filter((record): record is GameHistoryRecord =>
      Boolean(record && typeof record === "object" && typeof record.id === "string" && typeof record.completedAt === "number" && typeof record.gameName === "string"),
    );
  } catch {
    return [];
  }
}

export function saveGameHistory(record: GameHistoryRecord) {
  try {
    const current = readGameHistory();
    const next = [record, ...current.filter((item) => item.id !== record.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The finished match remains available on the results screen if storage is unavailable.
  }
}
