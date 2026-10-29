import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { games } from "@/config/games";
import type { LiveMessage, ReportEvent } from "@/lib/games/types";
import { JUDGE_DIR, PYTHON } from "@/lib/judge/python";
import { verifyReport, verifySigned } from "@/lib/reports/verify";

/**
 * POST  /api/judge/live   JSON {game, teams, players, rules, paused} → NDJSON stream of LiveMessage
 *   Runs judge.py --live on the webcam (BAYT_CAMERA, default 0). Every score event is HMAC-signed by
 *   Python and verified here; anything that fails is dropped. When the judge stops, the signed
 *   report.json is verified and sent as the last message.
 * PATCH /api/judge/live   JSON {cmd: "pause" | "resume" | "stop" | "seeker A" | "seeker B"}
 * Local only. One live session at a time, because only one process can hold the camera.
 */

export const maxDuration = 3600;

let current: ChildProcess | null = null;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export async function POST(request: Request) {
  const secret = process.env.BAYT_REPORT_SECRET;
  if (!secret) return Response.json({ reason: "BAYT_REPORT_SECRET isn't set on the server. Add it to .env.local and restart npm run dev." }, { status: 500 });

  const config = await request.json().catch(() => null);
  const game = isObj(config) ? games.find((g) => g.id === config.game)?.id : undefined;
  if (!isObj(config) || !game) return Response.json({ reason: "Pick a game first." }, { status: 400 });

  current?.kill();
  const runId = `live-${Date.now()}`;
  const uploads = path.join(JUDGE_DIR, "uploads");
  await mkdir(uploads, { recursive: true });
  const cfgFile = path.join(uploads, `${runId}.json`);
  await writeFile(cfgFile, JSON.stringify({ game, teams: config.teams, players: config.players ?? [], rules: config.rules ?? {}, paused: !!config.paused, judge: { seeker: config.seeker === "B" ? "B" : "A" } }));

  const out = path.join("outputs", runId);
  const child = spawn(PYTHON, ["judge.py", "--live", "--input", process.env.BAYT_CAMERA ?? "0", "--config", cfgFile, "--out", out], {
    cwd: JUDGE_DIR,
    env: { ...process.env, BAYT_REPORT_SECRET: secret, PYTHONIOENCODING: "utf-8" },
  });
  current = child;
  request.signal.addEventListener("abort", () => child.kill());

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    start(ctrl) {
      const send = (msg: LiveMessage) => {
        try {
          ctrl.enqueue(enc.encode(JSON.stringify(msg) + "\n"));
        } catch {
          /* the browser already went away */
        }
      };
      let buf = "";
      let tail: string[] = [];
      const note = (text: string) => (tail = [...tail, ...text.split(/\r?\n/).filter((l) => l.trim())].slice(-3));

      const handle = (line: string) => {
        if (!line.startsWith("{")) return void note(line);
        let msg: Record<string, unknown>;
        try {
          msg = JSON.parse(line);
        } catch {
          return;
        }
        if (msg.type === "tick") send(msg as LiveMessage);
        if (msg.type === "event") {
          const v = verifySigned(msg.signed, secret);
          if (v.status === "verified" && v.payload.run_id === runId && isObj(v.payload.event)) {
            send({ type: "event", runId, event: v.payload.event as ReportEvent });
          }
        }
      };

      child.stdout.on("data", (d) => {
        buf += d;
        let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          handle(buf.slice(0, i).trim());
          buf = buf.slice(i + 1);
        }
      });
      child.stderr.on("data", (d) => note(String(d)));
      child.on("error", (err) => note(String(err)));
      child.on("close", async (code) => {
        if (current === child) current = null;
        if (code === 0) {
          try {
            const report = JSON.parse(await readFile(path.join(JUDGE_DIR, out, "report.json"), "utf8"));
            send({ type: "report", result: verifyReport(report, secret) });
          } catch {
            send({ type: "error", reason: "The live judge stopped without a report." });
          }
        } else if (!request.signal.aborted) {
          send({ type: "error", reason: tail.join(" ") || "The live judge stopped unexpectedly." });
        }
        try {
          ctrl.close();
        } catch {
          /* already closed */
        }
      });
    },
    cancel() {
      child.kill();
    },
  });

  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-cache" } });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const cmd = isObj(body) ? body.cmd : null;
  if (!current || typeof cmd !== "string" || !/^(pause|resume|stop|seeker [AB])$/.test(cmd)) {
    return Response.json({ ok: false }, { status: 400 });
  }
  current.stdin?.write(cmd + "\n");
  return Response.json({ ok: true });
}
