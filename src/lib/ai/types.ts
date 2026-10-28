export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** POST /api/ai body */
export interface AiRequest {
  messages: ChatMessage[];
  /** Optional task name, e.g. "summarise-week"; useful for routing prompts tomorrow. */
  task?: string;
  /** Optional structured data from the UI (e.g. the current family state). */
  context?: Record<string, unknown>;
}

/** POST /api/ai success response */
export interface AiResponse {
  id: string;
  mode: "mock" | "live";
  provider: string;
  model: string;
  message: { role: "assistant"; content: string };
  data?: unknown;
  latencyMs: number;
}

/** Error response shape for every non-2xx status */
export interface AiError {
  error: { code: string; message: string };
}

export interface GenerateInput {
  system: string;
  messages: ChatMessage[];
}

export interface GenerateOutput {
  content: string;
  model: string;
}

export interface AiProvider {
  name: string;
  generate(input: GenerateInput): Promise<GenerateOutput>;
}

/** Thrown by providers; mapped to a 502 by the route. */
export class ProviderError extends Error {
  constructor(
    message: string,
    public code: string = "provider_error",
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
