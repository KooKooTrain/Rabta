import { createHmac, timingSafeEqual } from "node:crypto";
import { games } from "@/config/games";
import type { ReportPayload, VerifyResult } from "@/lib/games/types";

/**
 * Server-only. Verifies AI judge reports signed by python-judge/report.py.
 * Canon "bayt-canon-v1": keys sorted by code point, arrays in order, no whitespace,
 * raw UTF-8, integers only. Must match Python
 * json.dumps(p, sort_keys=True, separators=(",", ":"), ensure_ascii=False).
 */

export function canonical(value: unknown): string {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) throw new Error("Report payload may only contain integers.");
    return String(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // Keys are ASCII, so UTF-16 order equals code point order.
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(",")}}`;
  }
  throw new Error(`Unsupported value in report payload: ${typeof value}`);
}

export function sign(payload: unknown, secret: string): string {
  return createHmac("sha256", secret).update(canonical(payload), "utf8").digest("hex");
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Just enough shape checking that a correctly signed payload is safe to render. */
function shapeError(p: Record<string, unknown>): string | null {
  if (!games.some((g) => g.id === p.game)) return "This report is for a game I don't know.";
  if (typeof p.run_id !== "string" || !/^[\w.-]+$/.test(p.run_id)) return "The run id is missing or malformed.";
  if (!Array.isArray(p.events) || !Array.isArray(p.tracks) || !Array.isArray(p.teams)) return "Events, tracks or teams are missing.";
  if (!isObj(p.proposed_score) || !isObj(p.possession_ms)) return "Score or possession data is missing.";
  const ids = new Set<string>();
  for (const e of p.events) {
    if (!isObj(e) || typeof e.id !== "string" || !isObj(e.score_change)) return "An event is malformed.";
    if (ids.has(e.id)) return `Event id ${e.id} appears twice.`;
    ids.add(e.id);
  }
  return null;
}

export function verifyReport(report: unknown, secret: string): VerifyResult {
  if (!isObj(report)) return { status: "invalid", reason: "The report must be a JSON object." };
  const { alg, canon, payload, signature } = report;
  if (alg !== "HMAC-SHA256" || canon !== "bayt-canon-v1") {
    return { status: "invalid", reason: "Unknown signing method. I only accept HMAC-SHA256 reports from the Bayt judge." };
  }
  if (typeof signature !== "string" || !/^[0-9a-f]{64}$/.test(signature)) {
    return { status: "invalid", reason: "The signature is missing or malformed." };
  }
  if (!isObj(payload)) return { status: "invalid", reason: "The report has no payload." };

  let expected: string;
  try {
    expected = sign(payload, secret);
  } catch (err) {
    return { status: "invalid", reason: err instanceof Error ? err.message : "The payload can't be canonicalised." };
  }
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { status: "invalid", reason: "The signature doesn't match the contents. Something in this report was changed after the judge signed it." };
  }

  const shape = shapeError(payload);
  if (shape) return { status: "invalid", reason: shape };
  return { status: "verified", payload: payload as ReportPayload };
}
