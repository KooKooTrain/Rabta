"use client";

import { Check } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useMatch } from "@/lib/games/match";
import type { Step } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { GamePicker } from "./GamePicker";
import { JudgeStep } from "./JudgeStep";
import { ResultsStep } from "./ResultsStep";
import { useLiveJudge } from "./LiveJudge";
import { RoundStep } from "./RoundStep";
import { RulesStep } from "./RulesStep";
import { TeamsStep } from "./TeamsStep";

const STEPS: { id: Step; label: string }[] = [
  { id: "game", label: "Choose game" },
  { id: "teams", label: "Players and teams" },
  { id: "rules", label: "Rules" },
  { id: "round", label: "Round" },
  { id: "judge", label: "AI judge" },
  { id: "results", label: "Results" },
];

export function PlayWizard() {
  const m = useMatch();
  const live = useLiveJudge(m);
  const { state } = m;
  const current = STEPS.findIndex((s) => s.id === state.step);
  const started = state.startedAt !== null || state.elapsedMs > 0 || state.round > 1;

  // Before kick-off you can step back to any setup screen; after it, only results -> judge.
  const canVisit = (i: number) =>
    i < current && (!started ? true : STEPS[i].id === "judge");

  return (
    <div className="pb-24">
      <nav aria-label="Match progress" className="border-b border-line">
        <Container>
          <ol className="flex gap-2 overflow-x-auto py-4">
            {STEPS.map((s, i) => {
              const isCurrent = i === current;
              const done = i < current;
              const cls = cn(
                "inline-flex h-9 items-center gap-2 rounded-pill border px-3.5 text-sm whitespace-nowrap",
                isCurrent && "border-transparent bg-accent text-accent-fg",
                !isCurrent && "border-line-strong",
                !isCurrent && !done && "text-muted",
              );
              const content = (
                <>
                  <span className="font-display text-base leading-none">
                    {done ? <Check aria-hidden="true" className="size-4" /> : i + 1}
                  </span>
                  {s.label}
                </>
              );
              return (
                <li key={s.id}>
                  {canVisit(i) ? (
                    <button
                      type="button"
                      onClick={() => m.goto(s.id)}
                      className={cn(cls, "transition-colors hover:border-fg")}
                    >
                      {content}
                    </button>
                  ) : (
                    <span className={cls} aria-current={isCurrent ? "step" : undefined}>
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </Container>
      </nav>

      <Container className="pt-10 md:pt-14">
        {state.step === "game" && <GamePicker m={m} />}
        {state.step === "teams" && <TeamsStep m={m} />}
        {state.step === "rules" && <RulesStep m={m} />}
        {state.step === "round" && <RoundStep m={m} judge={live} />}
        {state.step === "judge" && <JudgeStep m={m} live={live} />}
        {state.step === "results" && <ResultsStep m={m} />}
      </Container>
    </div>
  );
}
