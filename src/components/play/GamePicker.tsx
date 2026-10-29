import { games, groupLabels } from "@/config/games";
import { ActionButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import type { MatchApi } from "@/lib/games/match";
import type { GameGroup, GameModule } from "@/lib/games/types";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { StepHeader } from "./parts";

const GROUPS: GameGroup[] = ["worldwide", "emirati"];

export function GamePicker({ m }: { m: MatchApi }) {
  return (
    <div className="flex flex-col gap-12">
      <StepHeader
        label="Step 1"
        title="Pick today's game"
        intro="Football is ready to play with my AI judge. The others are on the way, so you can see what's coming."
      />
      {GROUPS.map((group) => (
        <section key={group} aria-labelledby={`group-${group}`} className="flex flex-col gap-5">
          <h2 id={`group-${group}`} className="label-caps text-muted">
            [ {groupLabels[group]} ]
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games
              .filter((g) => g.group === group)
              .map((g) => (
                <li
                  key={g.id}
                  className={cn(g.status === "active" && "md:col-span-2 xl:col-span-3")}
                >
                  <GameCard game={g} onPlay={() => m.selectGame(g.id)} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function GameCard({ game, onPlay }: { game: GameModule; onPlay: () => void }) {
  const active = game.status === "active";
  return (
    <article
      aria-disabled={active ? undefined : true}
      className={cn(
        "flex h-full flex-col gap-5 rounded-card border p-6 md:p-7",
        active ? "border-fg bg-surface md:flex-row md:items-end md:justify-between md:p-9" : "border-line bg-soft/40",
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
          <h3 className={cn("font-display", active ? "text-display-lg" : "text-title")}>{game.name}</h3>
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
        <ActionButton size="lg" onClick={onPlay} className="self-start md:self-end">
          Play {game.name}
        </ActionButton>
      )}
    </article>
  );
}
