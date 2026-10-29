import type { GameGroup, GameModule, Rules } from "@/lib/games/types";

const twoVtwo: Rules = { pointsPerGoal: 1, roundSeconds: 180, rounds: 1, tieBreak: "penalties" };

/** Game catalogue. Every game has a working judge; the zones live in python-judge/judge.py GAME_DEFAULTS. */
export const games: GameModule[] = [
  {
    id: "football",
    name: "Football",
    group: "worldwide",
    status: "active",
    icon: "goal",
    format: "2v2 goal challenge",
    blurb: "Two teams, one ball, a pair of goals. Record the match and I'll judge the goals afterwards.",
    defaultRules: twoVtwo,
    scoreWord: "goal",
    ball: true,
    judge: {
      implemented: true,
      capabilities: ["Goals", "Player and ball tracking", "Team colours", "Possession", "MVP"],
    },
  },
  {
    id: "basketball",
    name: "Basketball",
    group: "worldwide",
    status: "active",
    icon: "circle-dot",
    format: "2v2 mini-hoop duel",
    blurb: "Go head to head on one mini hoop. I give the basket to whichever team last had the ball.",
    defaultRules: { ...twoVtwo, pointsPerGoal: 2, tieBreak: "golden-goal" },
    scoreWord: "basket",
    ball: true,
    judge: { implemented: true, capabilities: ["Baskets", "Last touch", "Team colours", "Possession", "MVP"] },
  },
  {
    id: "volleyball",
    name: "Volleyball",
    group: "worldwide",
    status: "active",
    icon: "volleyball",
    format: "2v2 garden volleyball",
    blurb: "A net down the middle. When the ball lands on your side, the other team takes the point.",
    defaultRules: { ...twoVtwo, tieBreak: "golden-goal" },
    scoreWord: "point",
    ball: true,
    judge: { implemented: true, capabilities: ["Ball landings", "Court sides", "Team colours", "Possession", "MVP"] },
  },
  {
    id: "al-karabi",
    name: "Al Karabi",
    group: "emirati",
    status: "active",
    icon: "footprints",
    format: "Hop and push",
    blurb:
      "Players hop on one leg with their arms folded and try to push opponents out of the circle. Step out and you're out.",
    defaultRules: { ...twoVtwo, roundSeconds: 120, tieBreak: "draw" },
    scoreWord: "elimination",
    ball: false,
    judge: { implemented: true, capabilities: ["Boundaries", "Eliminations", "Team colours", "MVP"] },
  },
  {
    id: "al-ghomaidah",
    name: "Al Ghomaidah",
    group: "emirati",
    status: "active",
    icon: "eye-off",
    format: "Emirati blindman's buff",
    blurb: "Team A wears the blindfold and listens for the others. Every tag before time runs out is a point.",
    defaultRules: { ...twoVtwo, roundSeconds: 120, tieBreak: "draw" },
    scoreWord: "tag",
    ball: false,
    judge: { implemented: true, capabilities: ["Player tracking", "Tag detection", "Timing", "MVP"] },
  },
];

export const gameById = (id: string | null) => games.find((g) => g.id === id) ?? games[0];

export const groupLabels: Record<GameGroup, string> = {
  worldwide: "Worldwide games",
  emirati: "Emirati heritage",
};
