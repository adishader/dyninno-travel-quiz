import { t, type Dictionary } from "@/lib/i18n/getDictionary";

const CORRECT_COUNT = 5;
const WRONG_COUNT = 5;

export function getFeedbackPool(dict: Dictionary, outcome: "correct" | "wrong"): string[] {
  const count = outcome === "correct" ? CORRECT_COUNT : WRONG_COUNT;
  return Array.from({ length: count }, (_, i) => t(dict, `feedback.${outcome}.${i + 1}`));
}

export function pickFeedbackMessage(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}
