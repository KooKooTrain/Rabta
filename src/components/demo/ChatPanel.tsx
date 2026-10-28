"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Glyph } from "@/components/visuals/Glyph";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { AiError, AiResponse, ChatMessage } from "@/lib/ai/types";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type UiMessage = ChatMessage & { id: string; mode?: AiResponse["mode"] };

const MAX_HISTORY = 20;
let counter = 0;
const uid = () => `m${++counter}`;

/** Chat with /api/ai. Works in mock mode with no API key. */
export function ChatPanel({
  assistantName,
  suggestedPrompts,
}: {
  assistantName: string;
  suggestedPrompts: string[];
}) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inputId = useId();

  // Keep the newest message in view (scrolls the log, never the page)
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, pending, error, reduced]);

  async function request(history: UiMessage[]) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content })),
        }),
      });
      const json = (await res.json()) as AiResponse | AiError;
      if (!res.ok || "error" in json) {
        throw new Error("error" in json ? json.error.message : `HTTP ${res.status}`);
      }
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", content: json.message.content, mode: json.mode },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    const next = [...messages, { id: uid(), role: "user" as const, content }];
    setMessages(next);
    setInput("");
    void request(next);
  }

  const empty = messages.length === 0;

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease: ease.outSoft }}>
      <section className="flex h-full max-h-[min(680px,85dvh)] min-h-[420px] flex-col xl:max-h-none">
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="grid size-8 place-items-center rounded-full bg-tint">
            <Glyph name="spark" color="var(--color-ink)" className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base leading-tight">{assistantName}</h2>
            <p className="label-caps text-subtle">Explains · suggests · you decide</p>
          </div>
        </header>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5"
        >
          {empty && (
            <div className="rounded-tile bg-soft p-4">
              <p className="text-sm text-muted">
                Ask anything about the family week. Replies are scripted in mock mode, so it works with no API key.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-2.5", m.role === "user" && "justify-end")}
              >
                {m.role === "assistant" && (
                  <span aria-hidden="true" className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-tint">
                    <Glyph name="spark" color="var(--color-ink)" className="size-3.5" />
                  </span>
                )}
                <div className={cn("max-w-[85%]", m.role === "user" && "text-end")}>
                  <p className="sr-only">{m.role === "user" ? "You said:" : `${assistantName} said:`}</p>
                  <div
                    className={cn(
                      "rounded-tile px-4 py-3 text-start text-[0.9375rem] leading-relaxed whitespace-pre-line",
                      m.role === "user"
                        ? "rounded-ee-md bg-fg text-bg"
                        : "border border-line bg-surface text-fg",
                    )}
                  >
                    {m.content}
                  </div>
                  {m.mode && <p className="label-caps mt-1.5 text-[0.625rem] text-subtle">{m.mode} reply</p>}
                </div>
              </motion.div>
            ))}

            {pending && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5"
              >
                <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-tint">
                  <Glyph name="spark" color="var(--color-ink)" className="size-3.5" />
                </span>
                <span className="inline-flex gap-1 rounded-tile border border-line bg-surface px-4 py-3.5">
                  <span className="sr-only">{assistantName} is typing</span>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-muted"
                      animate={reduced ? undefined : { opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div role="alert" className="flex flex-wrap items-center gap-3 rounded-tile border border-brand-ink/40 bg-blush/50 px-4 py-3 text-sm">
              <span className="text-ink">Couldn&apos;t get a reply: {error}</span>
              <button
                type="button"
                onClick={() => void request(messages)}
                className="inline-flex items-center gap-1.5 rounded-pill border border-line-strong px-3 py-1 font-medium hover:bg-fg/5"
              >
                <RotateCcw aria-hidden="true" className="size-3.5" />
                Retry
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-line px-4 pt-3 pb-4">
          {empty && suggestedPrompts.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-2" aria-label="Suggested prompts">
              {suggestedPrompts.map((p) => (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => send(p)}
                    disabled={pending}
                    className="rounded-pill border border-line-strong px-3 py-1.5 text-start text-sm text-muted transition-colors duration-[var(--dur-fast)] hover:border-fg hover:text-fg disabled:opacity-50"
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 rounded-[1.5rem] border border-line-strong bg-surface p-2 focus-within:border-fg"
          >
            <label htmlFor={inputId} className="sr-only">
              Message {assistantName}
            </label>
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={4000}
              placeholder="Ask about your family week…"
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[0.9375rem] outline-none placeholder:text-subtle [field-sizing:content] focus-visible:outline-none"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={pending || input.trim().length === 0}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-fg transition-colors duration-[var(--dur-fast)] hover:bg-fg hover:text-bg disabled:bg-line disabled:text-subtle"
            >
              <ArrowUp aria-hidden="true" className="size-4" />
            </button>
          </form>
          <p className="label-caps mt-2 text-[0.625rem] text-subtle">Enter to send · Shift+Enter for a new line</p>
        </div>
      </section>
    </MotionConfig>
  );
}
