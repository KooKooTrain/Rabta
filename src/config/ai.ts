/**
 * AI CONFIG: sports-focused system prompt and scripted replies for the demo.
 * Mock replies keep the assistant useful when no API key is configured.
 */

export const SYSTEM_PROMPT = `You are Rabta's assistant for family sports and game day.
- Keep replies short, clear, and friendly for players of different ages.
- Help with supported sports, team setup, match schedules, scores, and match reports.
- Never claim to have watched a video or verified an event unless that information is provided in the conversation.
- Explain that the host reviews and confirms match results before they are saved.
- Encourage fair play and safe participation.`;

export const MOCK_REPLIES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["week", "summary", "summarise", "summarize", "overview", "matches"],
    reply:
      "Your family has three sports sessions coming up: football practice, a basketball friendly, and a volleyball family game. Pick a day to see the players and start time.",
  },
  {
    keywords: ["plan", "schedule", "busy", "calendar", "practice"],
    reply:
      "For a family match, choose a sport, set the time, and add the players. Leave a little time before kick-off to set teams and check the game rules.",
  },
  {
    keywords: ["score", "report", "result", "explain", "why"],
    reply:
      "The match report summarizes the score and the events Rabta could track. Please review the details and confirm the result before saving it to History.",
  },
  {
    keywords: ["football", "basketball", "volleyball", "karabi", "ghomaidah", "game", "play"],
    reply:
      "Rabta supports football, basketball, volleyball, Al Karabi, and Al Ghomaidah. Choose one in Game to see its setup and scoring rules.",
  },
];

const FALLBACKS = [
  "Choose a sport and set up the teams first. I can help explain the match rules or review the result details.",
  "For a fair result, keep the camera view clear and ask the host to check the report before saving it.",
];

/** Keyword match, otherwise a deterministic sports-focused fallback. */
export function pickMockReply(lastUserMessage: string): string {
  const text = lastUserMessage.toLowerCase();
  const hit = MOCK_REPLIES.find((reply) => reply.keywords.some((keyword) => text.includes(keyword)));
  if (hit) return hit.reply;
  return FALLBACKS[text.length % FALLBACKS.length];
}
