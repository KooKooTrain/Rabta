import type { GameId } from "@/lib/games/types";

export type Guide = {
  need: string;
  howTo: string[];
  /** The sport's real rules, each with a short line on why it matters. */
  realRules: { rule: string; why: string }[];
  tips: string[];
  history: string;
  /** One thing to look back on after the match. */
  afterMatch: string;
};

/** How-to-play content for each game. Tips are my own, not quotes from anyone. */
export const guides: Record<GameId, Guide> = {
  football: {
    need: "A ball, two small goals (bags or cones work) and a patch of grass about 15 by 10 steps.",
    howTo: [
      "Split into two teams of two and pick a goal each.",
      "Start in the middle. The team that didn't pick a goal kicks off.",
      "Pass, dribble and shoot. Get the ball fully past the line between the posts and it's a goal.",
      "After every goal, the team that conceded kicks off from the middle.",
    ],
    realRules: [
      { rule: "No hands at all.", why: "In a 2v2 there's no keeper, so nobody gets to use their hands." },
      { rule: "The team that conceded kicks off.", why: "It's the real restart rule, and it gives the losing side the ball straight back." },
      { rule: "Switch ends at half time.", why: "It evens out the wind, the sun and that one bumpy corner." },
      { rule: "Ball over the side line is a kick-in.", why: "I borrowed this from futsal. A kick is quicker than a throw in a small space." },
      { rule: "Level after both halves goes to penalties.", why: "It's the cleanest way to settle a draw with only four players." },
    ],
    tips: [
      "I always look up before I get the ball. Knowing where my partner is saves a touch.",
      "In a 2v2, one of us stays a little behind. If we both chase, the goal is wide open.",
      "Small goals reward low shots. I aim for the corners and keep it on the grass.",
      "When I'm tired, I pass more. The ball moves faster than I do.",
    ],
    history:
      "The modern rules were first written down in England in 1863. Small-sided games like this one are how most players learn, because everyone touches the ball a lot.",
    afterMatch: "Look at who had the ball most. In a 2v2 that's usually the team that won, but not always.",
  },
  basketball: {
    need: "A ball and one hoop. A mini hoop or a driveway hoop is fine. Mark a deep line about 4 steps from it.",
    howTo: [
      "Two teams of two share one hoop.",
      "A basket from inside the deep line is worth 1, from behind it 2.",
      "After a basket, the other team takes the ball under the hoop and goes again.",
      "If you win the ball back, take it behind the deep line before you can score.",
    ],
    realRules: [
      { rule: "1 point inside the arc, 2 beyond it.", why: "This is FIBA's 3x3 scoring, and it's why the deep shot matters." },
      { rule: "First to 21 or 10 minutes, whichever comes first.", why: "Real 3x3 games end early when someone hits 21." },
      { rule: "Overtime is first to score 2.", why: "It's short, fair and ends fast." },
      { rule: "Clear the ball behind the arc after a steal or rebound.", why: "It stops easy put-backs and keeps the half-court game fair." },
      { rule: "12 seconds to shoot.", why: "Real 3x3 uses a 12-second shot clock. I just count out loud at home." },
    ],
    tips: [
      "I take the 2 when I'm open. Two good deep shots beat three rushed layups.",
      "I check the ball every time. A quick reset stops arguments.",
      "On defence, I stay between my player and the hoop, not between them and the ball.",
      "If I miss, I chase my own rebound. Half of mine come straight back.",
    ],
    history:
      "Basketball was invented in 1891 with a peach basket. The 3x3 half-court version became an Olympic sport at the Tokyo Games.",
    afterMatch: "Count how many deep shots went in. In 3x3, the 2-pointer usually decides close games.",
  },
  volleyball: {
    need: "A light ball and a net or rope at about head height. A court of about 8 by 4 steps per side.",
    howTo: [
      "Two players a side. One serves from behind the back line.",
      "Each side gets up to three touches to get the ball back over.",
      "If the ball lands on your side or goes out off you, the other team wins the rally.",
      "Every rally scores a point, and whoever wins the rally serves next.",
    ],
    realRules: [
      { rule: "Rally scoring: every rally is a point.", why: "It keeps the score moving and every rally matters." },
      { rule: "Play to 21, win by 2.", why: "That's the beach set. A 21 to 20 lead isn't enough, so tight sets keep going." },
      { rule: "Three touches a side, and a block counts as one.", why: "In beach volleyball the block uses up a touch, which keeps rallies honest." },
      { rule: "Switch sides every 7 points.", why: "It evens out the sun and the wind, just like on the beach." },
      { rule: "Partners take turns to serve.", why: "When your team wins the serve back, the other player serves." },
    ],
    tips: [
      "I call the ball early and loud. Two people going for it is the easiest point to lose.",
      "My first touch goes high and to the middle. That gives my partner time.",
      "I serve deep at whoever looks least ready. Simple serves win a lot of family points.",
      "Bent knees before every rally. I can't move fast standing straight.",
    ],
    history:
      "Volleyball was invented in 1895 as a gentler indoor game. The two-a-side beach version grew up on Californian beaches and joined the Olympics in 1996.",
    afterMatch: "Check whether the set was close. With win by 2, a tight set often goes past 21.",
  },
  "al-karabi": {
    need: "A clear, soft patch of ground with a marked playing area, about 5 steps across. Grass or sand is best.",
    howTo: [
      "Everyone hops on one leg, holding the other foot bent behind them.",
      "Hop at your opponents and try to knock them off balance with your shoulder.",
      "If your raised foot touches the ground or you leave the area, you're out.",
      "The round ends when one team has nobody left.",
    ],
    realRules: [
      { rule: "Hold your raised foot behind you the whole time.", why: "That's the heart of the game. It's all about balance." },
      { rule: "Put your foot down and you're out.", why: "One touch of the raised foot ends your round, no arguing." },
      { rule: "Stay inside the area.", why: "Heritage versions are played between lines a few metres apart. I use an area so my judge can see the edge." },
      { rule: "Shoulders only. No grabbing or pulling.", why: "It's a test of balance and strength, not wrestling." },
    ],
    tips: [
      "I keep my hops small. Big jumps leave me off balance when I land.",
      "I swap legs between rounds, not during them. Fresh legs win the last round.",
      "I wait for my opponent to hop first, then I meet them as they land.",
      "Cheer for your team. It's part of the game, and it really does help.",
    ],
    history:
      "Al Karabi is on Abu Dhabi's heritage register as a team game of balance and strength. It was traditionally played with lots of cheering from the side.",
    afterMatch: "See who lasted longest in each round. In Al Karabi, staying up matters as much as knocking others down.",
  },
  "al-ghomaidah": {
    need: "A clear, flat space with nothing to trip on, a soft blindfold, and an adult watching the edges.",
    howTo: [
      "One team wears blindfolds. The other team moves around them quietly.",
      "The blindfolded players listen and try to tag the others.",
      "Every tag is a point for the blindfolded team.",
      "Next round the teams swap, so everyone takes a turn in the dark.",
    ],
    realRules: [
      { rule: "Only the blindfolded team scores.", why: "The challenge is listening, so the tags count for them." },
      { rule: "Swap the blindfold every round.", why: "Everyone gets a turn to seek and a turn to hide." },
      { rule: "Hiders must keep moving inside the area.", why: "Standing still in a corner isn't in the spirit of the game." },
      { rule: "No running near walls or edges.", why: "The seekers can't see, so safety comes first." },
    ],
    tips: [
      "When I'm blindfolded, I stop and listen before I move. Footsteps give everyone away.",
      "When I'm hiding, I move when the seeker moves. Their own steps cover mine.",
      "Arms out low and slow. I tag more by sweeping than by grabbing.",
      "Seekers can talk to each other. I call out where I last heard someone.",
    ],
    history:
      "The name comes from the Arabic for closing your eyes. In the classic version, whoever gets caught wears the blindfold next. I swap by team instead so the score stays fair.",
    afterMatch: "Compare the two rounds. The team that listened better usually tagged more.",
  },
};
