/**
 * AI CONFIG: system prompt + scripted mock replies.
 * Mock replies are used whenever AI_PROVIDER=mock or no AI_API_KEY is set,
 * so the demo (and the video ad) works without any key.
 */

// [PLACEHOLDER] rewrite around the real problem tomorrow
export const SYSTEM_PROMPT = `You are a warm, practical family assistant inside a prototype app.
- Speak in plain, kind language that a grandparent or a 12-year-old can follow.
- Keep answers short: a one-line summary, then at most 3 concrete next steps.
- Explain WHY you suggest something and say how confident you are.
- You never diagnose medical, legal or financial issues; suggest asking a professional instead.
- People make the final decision. Offer options, never act on anyone's behalf.
- Respect privacy: only use information the family has shared in this conversation.`;

// [PLACEHOLDER] scripted replies: tailor these to the problem for the demo video
export const MOCK_REPLIES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["week", "summary", "summarise", "summarize", "overview"],
    reply:
      "Here's your family week at a glance: 14 events, 3 overlaps, and one evening with no plans.\n\n1. Thursday is the busiest day: two pickups overlap at 4:00.\n2. Grandma's check-in is due on Friday.\n3. Sunday evening is free, a good slot for a family dinner.\n\nConfidence: high, based on the shared calendars.",
  },
  {
    keywords: ["thursday", "plan", "schedule", "busy", "calendar"],
    reply:
      "Thursday has three overlaps between 3:30 and 5:00.\n\n1. Move the football pickup to 4:30. Coach's notes say practice runs late.\n2. Ask whoever is free at 4:00 to cover the pharmacy stop.\n3. Keep dinner simple: a 20-minute recipe is already on your list.\n\nWant me to share these suggestions with the family? You decide.",
  },
  {
    keywords: ["explain", "why", "simply", "suggestion", "how"],
    reply:
      "Simply put: I noticed the same person is booked in two places at once, and their rest time this week is 40% lower than usual. Moving one task spreads the load more fairly. This is only a suggestion; nothing changes until someone accepts it.",
  },
  {
    keywords: ["health", "sick", "doctor", "medicine", "pain"],
    reply:
      "I can't give medical advice, but I can help you stay organised. I can set a reminder to call your family doctor, note the symptoms you've shared so you don't forget them, and let the right family member know. If it feels urgent, please contact a medical professional or emergency services.",
  },
  {
    keywords: ["grand", "elder", "parent", "check"],
    reply:
      "Grandpa's last check-in was 2 days ago and everything looked normal.\n\n1. A short video call this evening would keep the routine going.\n2. His pharmacy refill is due on Saturday.\n3. He mentioned wanting help with his phone; Sami could help on Sunday.",
  },
];

const FALLBACKS = [
  "Good question. Based on what your family has shared, the most helpful next step is to pick one small task and assign it to someone who has time this week. Want me to suggest who?",
  "I've looked at the family overview. Nothing needs urgent attention, but two small reminders are coming up tomorrow. Should I list them?",
];

/** Keyword match, otherwise a deterministic fallback. */
export function pickMockReply(lastUserMessage: string): string {
  const text = lastUserMessage.toLowerCase();
  const hit = MOCK_REPLIES.find((r) => r.keywords.some((k) => text.includes(k)));
  if (hit) return hit.reply;
  return FALLBACKS[text.length % FALLBACKS.length];
}
