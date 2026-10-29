import type { VerifyResult } from "@/lib/games/types";
import { verifyReport } from "@/lib/reports/verify";

/**
 * POST /api/reports/verify   { report: SignedReport } → VerifyResult
 * The only place the signing secret is read. The browser never sees it and never
 * decides validity; it can only load a payload this route returned as "verified".
 */

const MAX_BYTES = 2_000_000;

const reply = (body: VerifyResult, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  const secret = process.env.BAYT_REPORT_SECRET;
  if (!secret) {
    return reply(
      { status: "error", reason: "BAYT_REPORT_SECRET isn't set on the server. Add it to .env.local and restart npm run dev." },
      500,
    );
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return reply({ status: "error", reason: "The upload was interrupted. Please try again." }, 400);
  }
  if (text.length > MAX_BYTES) return reply({ status: "invalid", reason: "That report is too large to be a Bayt judge report." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return reply({ status: "invalid", reason: "That isn't valid JSON." }, 400);
  }
  const report = typeof body === "object" && body !== null && "report" in body ? body.report : body;
  return reply(verifyReport(report, secret));
}
