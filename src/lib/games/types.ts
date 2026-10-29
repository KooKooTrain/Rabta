/**
 * Shared game framework types. Every game reuses Player/Team/Rules/MatchState and one judge report shape.
 */

export type TeamId = "A" | "B";
export type GameGroup = "worldwide" | "emirati";
export type GameStatus = "active" | "coming-soon";
export type TieBreak = "draw" | "golden-goal" | "penalties";

export type Player = { id: string; name: string; team: TeamId; ready: boolean };
export type Team = { id: TeamId; name: string; color: string }; // color = "#rrggbb"

export type Rules = {
  pointsPerGoal: number;
  roundSeconds: number;
  rounds: number;
  tieBreak: TieBreak;
};

export type GameId = "football" | "basketball" | "volleyball" | "al-karabi" | "al-ghomaidah";
export type EventType = "goal" | "basket" | "point" | "elimination" | "tag";

export type GameModule = {
  id: GameId;
  name: string;
  group: GameGroup;
  status: GameStatus;
  icon: string; // key in lib/icons.ts
  format: string; // e.g. "2v2 penalty shootout"
  blurb: string;
  defaultRules: Rules;
  judge: { implemented: boolean; capabilities: string[] };
  /** What one scoring event is called, e.g. "goal", "basket", "tag". */
  scoreWord: string;
  /** Ball games get possession stats; the others rank players by events. */
  ball: boolean;
};

/* ── Signed AI judge report (canon "bayt-canon-v1") ───────────────────────────
 * Canonical JSON = keys sorted by code point, arrays in order, separators "," and ":"
 * with no whitespace, raw UTF-8, INTEGERS ONLY (no floats anywhere in payload).
 * signature = hex(HMAC-SHA256(BAYT_REPORT_SECRET, utf8(canonical(payload)))).
 * Python: json.dumps(p, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
 */

export type ReportEvent = {
  id: string; // "goal-1"
  type: EventType;
  t_ms: number;
  team: TeamId; // team that scored
  scorer_track: number | null; // last track confidently in possession
  confidence: number; // 0-100
  needs_review: boolean;
  reason: string;
  thumb: string; // file name inside the run folder, e.g. "thumbs/goal-1.jpg"
  score_change: Record<TeamId, number>;
};

export type ReportTrack = {
  track_id: number;
  team: TeamId | null;
  possession_ms: number;
  visible_ms: number;
};

export type ReportPayload = {
  run_id: string;
  game: GameId;
  created_at: string; // ISO 8601
  source: { file: string; fps: number; duration_ms: number; frames_processed: number };
  teams: Team[];
  players: string[];
  tracks: ReportTrack[];
  events: ReportEvent[];
  proposed_score: Record<TeamId, number>;
  possession_ms: { A: number; B: number; none: number };
  mvp_track: number | null;
  annotated_video: string | null; // file name inside the run folder
  review_threshold: number;
  simulated: false;
};

export type SignedReport = {
  alg: "HMAC-SHA256";
  canon: "bayt-canon-v1";
  payload: ReportPayload;
  signature: string;
};

export type VerifyResult =
  | { status: "verified"; payload: ReportPayload }
  | { status: "invalid"; reason: string }
  | { status: "error"; reason: string };

/* ── Match state (one authoritative copy, client side) ─────────────────────── */

export type Step = "game" | "teams" | "rules" | "round" | "judge" | "results";
export type Review = "confirmed" | "rejected";

export type MatchState = {
  step: Step;
  gameId: string | null;
  teams: Record<TeamId, Team>;
  players: Player[];
  rules: Rules;
  round: number;
  startedAt: number | null; // epoch ms of the current round start
  elapsedMs: number; // banked time from finished rounds
  score: Record<TeamId, number>; // the OFFICIAL score
  report: ReportPayload | null; // verified, immutable
  reviews: Record<string, Review>; // host overrides, by event id
  trackMap: Record<string, string>; // track_id -> player id (host mapping)
  appliedEventIds: string[];
  finishedAt: number | null;
};
