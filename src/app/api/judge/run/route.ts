import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { games } from "@/config/games";
import type { VerifyResult } from "@/lib/games/types";
import { verifyReport } from "@/lib/reports/verify";

/**
 * POST /api/judge/run   multipart { video: .mp4, config: JSON {teams, players, rules} } → VerifyResult
 * Saves the clip outside public/, runs python-judge/judge.py on it, and verifies the signed report
 * before returning it. Local only. Placeholder judge until the MediaPipe pipeline replaces it.
 * ponytail: runs one judge per request and holds the request open (~1 min per 100 s of video);
 * move to a job queue with progress polling if clips get long.
 */

export const maxDuration = 600;

const JUDGE_DIR = path.resolve(process.cwd(), "python-judge");
const PYTHON = path.join(JUDGE_DIR, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
const MAX_BYTES = 500_000_000;

const reply = (body: VerifyResult, status = 200) => Response.json(body, { status });

function runJudge(args: string[], secret: string): Promise<{ code: number; log: string }> {
  return new Promise((resolve) => {
    const child = spawn(PYTHON, ["judge.py", ...args], {
      cwd: JUDGE_DIR,
      env: { ...process.env, BAYT_REPORT_SECRET: secret, PYTHONIOENCODING: "utf-8" },
    });
    let log = "";
    child.stdout.on("data", (d) => (log += d));
    child.stderr.on("data", (d) => (log += d));
    child.on("error", (err) => resolve({ code: -1, log: String(err) }));
    child.on("close", (code) => resolve({ code: code ?? -1, log }));
  });
}

export async function POST(request: Request) {
  const secret = process.env.BAYT_REPORT_SECRET;
  if (!secret) {
    return reply({ status: "error", reason: "BAYT_REPORT_SECRET isn't set on the server. Add it to .env.local and restart npm run dev." }, 500);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ status: "error", reason: "I couldn't read that upload. Please try again." }, 400);
  }
  const video = form.get("video");
  if (!(video instanceof File) || !/\.mp4$/i.test(video.name)) {
    return reply({ status: "error", reason: "Please choose an .mp4 file." }, 400);
  }
  if (video.size > MAX_BYTES) return reply({ status: "error", reason: "That clip is over 500 MB. Please trim it first." }, 413);

  let config: { game?: unknown; teams?: unknown; players?: unknown; rules?: unknown };
  try {
    config = JSON.parse(String(form.get("config") ?? "{}"));
  } catch {
    return reply({ status: "error", reason: "The match setup didn't come through. Go back to teams and try again." }, 400);
  }

  const game = games.find((g) => g.id === config.game)?.id;
  if (!game) return reply({ status: "error", reason: "Pick a game first, then upload the clip." }, 400);

  // Football tuning (goal zones, ball colour) comes from the example config; the other games use the
  // per-game defaults in judge.py. Teams, players and rules always come from the host.
  const base = JSON.parse(await readFile(path.join(JUDGE_DIR, "config.example.json"), "utf8"));
  if (game !== "football") delete base.judge;
  const runId = `upload-${Date.now()}`;
  const uploads = path.join(JUDGE_DIR, "uploads");
  await mkdir(uploads, { recursive: true });
  const clip = path.join(uploads, `${runId}.mp4`);
  const cfgFile = path.join(uploads, `${runId}.json`);
  await writeFile(clip, Buffer.from(await video.arrayBuffer()));
  await writeFile(cfgFile, JSON.stringify({ ...base, game, teams: config.teams ?? base.teams, players: config.players ?? [], rules: config.rules ?? base.rules }));

  const { code, log } = await runJudge(["--input", clip, "--config", cfgFile, "--out", path.join("outputs", runId)], secret);
  if (code !== 0) {
    const last = log.trim().split(/\r?\n/).slice(-3).join(" ");
    return reply({ status: "error", reason: `The judge couldn't finish: ${last || "unknown error"}` }, 500);
  }

  const report = JSON.parse(await readFile(path.join(JUDGE_DIR, "outputs", runId, "report.json"), "utf8"));
  return reply(verifyReport(report, secret));
}
