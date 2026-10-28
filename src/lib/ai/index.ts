import { mockProvider } from "./providers/mock";
import { openAiCompatibleProvider } from "./providers/openai-compatible";
import type { AiProvider, GenerateInput, GenerateOutput } from "./types";

/**
 * Server-only AI config from env vars (see .env.example).
 *   AI_PROVIDER = mock | openai-compatible   (default: mock)
 *   AI_API_KEY, AI_MODEL, AI_BASE_URL
 * Never import this into a client component.
 */
export function getAiConfig() {
  const provider = (process.env.AI_PROVIDER || "mock").trim().toLowerCase();
  const apiKey = process.env.AI_API_KEY?.trim() || "";
  return {
    provider,
    apiKey,
    model: process.env.AI_MODEL?.trim() || undefined,
    baseUrl: process.env.AI_BASE_URL?.trim() || undefined,
  };
}

/** True when a real provider is configured (provider != mock AND a key is set). */
export function isLive(): boolean {
  const { provider, apiKey } = getAiConfig();
  return provider !== "mock" && apiKey.length > 0;
}

function resolveProvider(): AiProvider {
  const cfg = getAiConfig();
  if (!isLive()) return mockProvider;

  switch (cfg.provider) {
    case "openai":
    case "openai-compatible":
    case "groq":
    case "openrouter":
    case "gemini":
    case "ollama":
      return openAiCompatibleProvider({ apiKey: cfg.apiKey, model: cfg.model, baseUrl: cfg.baseUrl });

    // ── Anthropic adapter goes here (not implemented) ─────────────────────
    // case "anthropic":
    //   POST https://api.anthropic.com/v1/messages
    //   headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" }
    //   body:    { model: cfg.model ?? "claude-sonnet-5-5", max_tokens: 1024, system, messages }
    //   reply:   json.content[0].text
    //   Copy providers/openai-compatible.ts as a starting point.

    default:
      return mockProvider;
  }
}

export function activeProviderName(): string {
  return isLive() ? getAiConfig().provider : "mock";
}

export async function generate(input: GenerateInput): Promise<GenerateOutput> {
  return resolveProvider().generate(input);
}
