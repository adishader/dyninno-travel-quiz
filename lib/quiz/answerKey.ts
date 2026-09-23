import type { OptionLetter } from "./types";

// Correct option per question — from CLAUDE.md's "Quiz question answer key" table.
// Not present in the translations sheet by design (see CLAUDE.md, Translations source file).
export const answerKey: Record<number, OptionLetter> = {
  1: "a",
  2: "a",
  3: "b",
  4: "c",
  5: "c",
  6: "b",
  7: "b",
  8: "a",
  9: "b",
  10: "b",
  11: "c",
  12: "c",
  13: "c",
  14: "b",
  15: "c",
};

export const QUESTION_COUNT = Object.keys(answerKey).length;
