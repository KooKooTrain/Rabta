import { pickMockReply } from "@/config/ai";
import type { AiProvider } from "../types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Scripted replies from src/config/ai.ts with a realistic 600–900ms delay. */
export const mockProvider: AiProvider = {
  name: "mock",
  async generate({ messages }) {
    await sleep(600 + Math.floor(Math.random() * 300));
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    return { content: pickMockReply(lastUser?.content ?? ""), model: "mock-1" };
  },
};
