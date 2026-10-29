import type { GameGroup, GameModule, Rules } from "@/lib/games/types";

const twoVtwo: Rules = { pointsPerGoal: 1, roundSeconds: 180, rounds: 1, tieBreak: "penalties" };

/** Game catalogue. Only Football has a working AI judge today. */
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
    judge: {
      implemented: true,
      capabilities: ["Goals", "Player and ball tracking", "Team colours", "Possession", "MVP"],
    },
  },
  {
    id: "basketball",
    name: "Basketball",
    group: "worldwide",
    status: "coming-soon",
    icon: "circle-dot",
    format: "2v2 Around the World or mini-hoop duel",
    blurb: "Take turns shooting from set spots, or go head to head on a mini hoop.",
    defaultRules: { ...twoVtwo, tieBreak: "draw" },
    judge: { implemented: false, capabilities: ["Shots", "Baskets", "Attempts", "Team scores"] },
  },
  {
    id: "dodgeball",
    name: "Dodgeball",
    group: "worldwide",
    status: "coming-soon",
    icon: "volleyball",
    format: "2v2 elimination",
    blurb: "Get hit and you're out. The last team standing wins the round.",
    defaultRules: { ...twoVtwo, tieBreak: "draw" },
    judge: { implemented: false, capabilities: ["Hits", "Eliminations", "Winner"] },
  },
  {
    id: "al-karabi",
    name: "Al Karabi",
    group: "emirati",
    status: "coming-soon",
    icon: "footprints",
    format: "Hop and push",
    blurb:
      "Players hop on one leg with their arms folded and try to push opponents out of bounds or off balance.",
    defaultRules: { ...twoVtwo, tieBreak: "draw" },
    judge: {
      implemented: false,
      capabilities: ["Foot contact", "Stability", "Boundaries", "Elimination"],
    },
  },
  {
    id: "al-ghomaidah",
    name: "Al Ghomaidah",
    group: "emirati",
    status: "coming-soon",
    icon: "eye-off",
    format: "Emirati blindman's buff",
    blurb: "One blindfolded player listens and reaches out to tag the others before time runs out.",
    defaultRules: { ...twoVtwo, tieBreak: "draw" },
    judge: {
      implemented: false,
      capabilities: ["Spatial tracking", "Tag detection", "Timing"],
    },
  },
];

export const groupLabels: Record<GameGroup, string> = {
  worldwide: "Worldwide games",
  emirati: "Emirati heritage",
};
