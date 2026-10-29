"use client";

import { useRef } from "react";
import { BookOpen, X } from "lucide-react";
import { games, groupLabels } from "@/config/games";
import { guides } from "@/config/guides";
import { ActionButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import type { MatchApi } from "@/lib/games/match";
import type { GameGroup, GameModule } from "@/lib/games/types";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { StepHeader, smallBtn } from "./parts";

const GROUPS: GameGroup[] = ["worldwide", "emirati"];

export function GamePicker({ m }: { m: MatchApi }) {
  return (
    <div className="flex flex-col gap-12">
      <StepHeader
        label="Step 1"
        title="Pick today's game"
        intro="Every game here has my AI judge. Pick one, record the match on a phone, and I'll check the footage afterwards."
      />
      {GROUPS.map((group) => (
        <section key={group} aria-labelledby={`group-${group}`} className="flex flex-col gap-5">
          <h2 id={`group-${group}`} className="label-caps text-muted">
            [ {groupLabels[group]} ]
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games
              .filter((g) => g.group === group)
              .map((g, index) => (
                <li key={g.id}>
                  <GameCard game={g} index={index} onPlay={() => m.selectGame(g.id)} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function GameCard({ game, index, onPlay }: { game: GameModule; index: number; onPlay: () => void }) {
  const active = game.status === "active";
  return (
    <article
      aria-disabled={active ? undefined : true}
      style={{ animationDelay: `${index * 65}ms` }}
      className={cn(
        "game-card flex h-full flex-col gap-5 rounded-card border-0 p-6 md:p-7",
        active ? "bg-surface" : "bg-soft/40",
      )}
    >
      <div className={cn("flex flex-col gap-4", !active && "opacity-60")}>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full border border-line-strong">
            <Icon name={game.icon as IconName} className="size-5" />
          </span>
          {active ? (
            <Pill className="border-transparent bg-accent text-accent-fg" dot>
              Available now
            </Pill>
          ) : (
            <Pill>Coming soon</Pill>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-title">{game.name}</h3>
          <p className="label-caps text-muted">{game.format}</p>
          <p className="max-w-xl text-muted">{game.blurb}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            {active ? "What my judge checks:" : "What the judge will check, once it's built:"}
          </p>
          <ul className="flex flex-wrap gap-2">
            {game.judge.capabilities.map((c) => (
              <li key={c}>
                <Pill className="text-xs">{c}</Pill>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {active && (
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <ActionButton className="font-light" onClick={onPlay}>Play {game.name}</ActionButton>
          <GuideButton game={game} />
        </div>
      )}
    </article>
  );
}

/** "How to play" opens a native modal dialog, so Esc and focus trapping come for free. */
export function GuideButton({ game }: { game: GameModule }) {
  const ref = useRef<HTMLDialogElement>(null);
  const guide = guides[game.id];
  const close = () => ref.current?.close();
  return (
    <>
      <button type="button" className={smallBtn} onClick={() => ref.current?.showModal()}>
        <BookOpen aria-hidden="true" className="size-4" />
        How to play
      </button>
      <dialog
        ref={ref}
        aria-labelledby={`guide-${game.id}`}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[min(42rem,calc(100%-2rem))] rounded-card border border-line bg-bg p-0 text-fg backdrop:bg-black/60"
      >
        <div data-lenis-prevent className="flex max-h-[85vh] flex-col gap-7 overflow-y-auto p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="label-caps text-muted">[ How to play ]</p>
              <h2 id={`guide-${game.id}`} className="font-display text-display-md">
                {game.name}
              </h2>
            </div>
            <button type="button" className={cn(smallBtn, "w-9 px-0")} onClick={close} aria-label="Close guide">
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <p className="text-muted">{guide.need}</p>
          <section className="flex flex-col gap-3">
            <h3 className="label-caps text-muted">[ The basics ]</h3>
            <ol className="flex list-decimal flex-col gap-1.5 ps-5">
              {guide.howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="label-caps text-muted">[ The real rules ]</h3>
            <ul className="flex flex-col gap-3">
              {guide.realRules.map((r) => (
                <li key={r.rule} className="flex flex-col gap-0.5 rounded-tile border border-line p-3">
                  <span className="font-medium">{r.rule}</span>
                  <span className="text-sm text-muted">{r.why}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="label-caps text-muted">[ My tips ]</h3>
            <ul className="flex list-disc flex-col gap-1.5 ps-5">
              {guide.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2 rounded-tile bg-soft p-4">
            <h3 className="label-caps text-muted">[ A bit of history ]</h3>
            <p className="text-sm">{guide.history}</p>
          </section>
        </div>
      </dialog>
    </>
  );
}
