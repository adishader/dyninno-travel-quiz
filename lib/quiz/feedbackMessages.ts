import type { Locale } from "@/lib/i18n/locales";

// Submit-button feedback text, from CLAUDE.md's Quiz flow spec. CLAUDE.md and the
// translations sheet only provide these in English (no `quiz.feedback.*` rows exist) —
// Spanish copy is not yet sourced, so the ES pool mirrors EN as a placeholder until
// real Spanish wording is provided (needed before Build Order step 11).
const en = {
  correct: ["Correct! 🥳", "Just wow! 👏", "Amazing! 🤩", "Nailed it! 💅", "You are on fire! 💃"],
  wrong: ["Now you know... 🤷🏻‍♀️", "So close! 👀", "We're always learning 🧐", "Hmmm 🤔", "Oops 🙈"],
};

export const feedbackMessages: Record<Locale, { correct: string[]; wrong: string[] }> = {
  en,
  es: en,
};

export function pickFeedbackMessage(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}
