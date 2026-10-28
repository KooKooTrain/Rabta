import { SYSTEM_PROMPT } from "@/config/ai";
import { activeProviderName, generate, getAiConfig, isLive } from "@/lib/ai";
import { ProviderError, type AiError, type AiResponse, type ChatMessage } from "@/lib/ai/types";

/**
 * POST /api/ai   { messages: [{role, content}], task?, context? } → AiResponse
 * GET  /api/ai   health check → { ok, mode, provider }
 * Mock mode is used when AI_PROVIDER=mock or AI_API_KEY is empty.
 */

const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

// Netlify/Vercel: allow slower model replies (Netlify free tier caps sync functions lower).
export const maxDuration = 30;

function fail(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } } satisfies AiError, { status });
}

function validate(body: unknown): { messages: ChatMessage[]; task?: string; context?: Record<string, unknown> } | string {
  if (typeof body !== "object" || body === null) return "Body must be a JSON object.";
  const { messages, task, context } = body as Record<string, unknown>;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) {
    return `"messages" must be an array of 1–${MAX_MESSAGES} items.`;
  }
  for (const [i, m] of messages.entries()) {
    if (typeof m !== "object" || m === null) return `messages[${i}] must be an object.`;
    const { role, content } = m as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return `messages[${i}].role must be "user" or "assistant".`;
    if (typeof content !== "string" || content.trim().length === 0) return `messages[${i}].content must be a non-empty string.`;
    if (content.length > MAX_CHARS) return `messages[${i}].content exceeds ${MAX_CHARS} characters.`;
  }
  if (task !== undefined && typeof task !== "string") return `"task" must be a string.`;
  if (context !== undefined && (typeof context !== "object" || context === null || Array.isArray(context))) {
    return `"context" must be an object.`;
  }
  return {
    messages: (messages as ChatMessage[]).map(({ role, content }) => ({ role, content })),
    task: task as string | undefined,
    context: context as Record<string, unknown> | undefined,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_json", "Request body must be valid JSON.");
  }

  const parsed = validate(body);
  if (typeof parsed === "string") return fail(400, "invalid_request", parsed);

  const started = Date.now();
  try {
    // Tomorrow: use parsed.task / parsed.context to build a richer prompt.
    const system = parsed.context
      ? `${SYSTEM_PROMPT}\n\nFamily context (JSON):\n${JSON.stringify(parsed.context).slice(0, 4000)}`
      : SYSTEM_PROMPT;
    const out = await generate({ system, messages: parsed.messages });
    const res: AiResponse = {
      id: crypto.randomUUID(),
      mode: isLive() ? "live" : "mock",
      provider: activeProviderName(),
      model: out.model,
      message: { role: "assistant", content: out.content },
      latencyMs: Date.now() - started,
    };
    return Response.json(res);
  } catch (err) {
    if (err instanceof ProviderError) return fail(502, err.code, err.message);
    console.error("[api/ai] unexpected error", err instanceof Error ? err.message : err);
    return fail(500, "internal_error", "Something went wrong generating a reply.");
  }
}

export async function GET() {
  const { model } = getAiConfig();
  return Response.json({
    ok: true,
    mode: isLive() ? "live" : "mock",
    provider: activeProviderName(),
    model: isLive() ? (model ?? "default") : "mock-1",
  });
}
