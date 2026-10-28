import { ProviderError, type AiProvider } from "../types";

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini"; // fallback only; set AI_MODEL
const TIMEOUT_MS = 25_000;

/**
 * Any OpenAI-compatible Chat Completions API: OpenAI, Groq, OpenRouter,
 * Gemini (OpenAI-compatible endpoint), Ollama, LM Studio… No SDK needed.
 */
export function openAiCompatibleProvider(opts: {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}): AiProvider {
  const baseUrl = (opts.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = opts.model || DEFAULT_MODEL;

  return {
    name: "openai-compatible",
    async generate({ system, messages }) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${opts.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: system }, ...messages],
            temperature: 0.4,
          }),
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          // Never forward upstream bodies verbatim: they can echo request details.
          const code = res.status === 401 || res.status === 403 ? "auth_failed" : "upstream_error";
          throw new ProviderError(`AI provider returned HTTP ${res.status}`, code);
        }

        const json = (await res.json()) as {
          model?: string;
          choices?: { message?: { content?: string } }[];
        };
        const content = json.choices?.[0]?.message?.content?.trim();
        if (!content) throw new ProviderError("AI provider returned an empty reply", "empty_reply");
        return { content, model: json.model ?? model };
      } catch (err) {
        if (err instanceof ProviderError) throw err;
        if (err instanceof Error && err.name === "AbortError") {
          throw new ProviderError("AI provider timed out", "timeout");
        }
        throw new ProviderError("Could not reach the AI provider", "network_error");
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
