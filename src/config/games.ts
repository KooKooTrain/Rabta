import type { GameGroup, GameModule, Rules } from "@/lib/games/types";

const base: Rules = { pointsPerGoal: 1, roundSeconds: 300, rounds: 2, tieBreak: "penalties", mode: "real", target: null, winBy: 1 };

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
    defaultRules: base, // two halves of 5 min, penalties if level
    scoreWord: "goal",
    ball: true,
    mechanic: "kickoff",
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
    // FIBA 3x3: first to 21 or 10 minutes, overtime is first to score.
    defaultRules: { ...base, roundSeconds: 600, rounds: 1, tieBreak: "golden-goal", target: 21 },
    scoreWord: "basket",
    ball: true,
    mechanic: "possession",
    scoreButtons: [
      { label: "Inside", points: 1 },
      { label: "Deep", points: 2 },
    ],
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
    // Beach rules: rally scoring to 21, win by 2. Volleyball has no clock, so mine is only a cap.
    defaultRules: { ...base, roundSeconds: 900, rounds: 1, tieBreak: "golden-goal", target: 21, winBy: 2 },
    scoreWord: "point",
    ball: true,
    mechanic: "serve",
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
      "Hop on one leg, hold the other foot behind you, and knock opponents off balance. Put your foot down or step out and you're out.",
    defaultRules: { ...base, roundSeconds: 120, rounds: 3, tieBreak: "draw" },
    scoreWord: "elimination",
    ball: false,
    mechanic: "eliminations",
    judge: { implemented: true, capabilities: ["Boundaries", "Eliminations", "Team colours", "MVP"] },
  },
  {
    id: "al-ghomaidah",
    name: "Al Ghomaidah",
    group: "emirati",
    status: "active",
    icon: "eye-off",
    format: "Emirati blindman's buff",
    blurb: "One team wears the blindfold and listens for the others, then the teams swap. Every tag is a point.",
    // Two rounds so each team wears the blindfold once.
    defaultRules: { ...base, roundSeconds: 120, rounds: 2, tieBreak: "draw" },
    scoreWord: "tag",
    ball: false,
    mechanic: "blindfold",
    judge: { implemented: true, capabilities: ["Player tracking", "Tag detection", "Timing", "MVP"] },
  },
];

export const gameById = (id: string | null) => games.find((g) => g.id === id) ?? games[0];

export const groupLabels: Record<GameGroup, string> = {
  worldwide: "Worldwide games",
  emirati: "Emirati heritage",
};
