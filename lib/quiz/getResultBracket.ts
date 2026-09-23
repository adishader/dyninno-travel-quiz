export type ResultBracket = 1 | 2 | 3;

// Score brackets from CLAUDE.md: 1-7 / 8-12 / 13-15. A score of 0 (all wrong)
// isn't explicitly listed; treated as bracket 1, the lowest defined range.
export function getResultBracket(score: number): ResultBracket {
  if (score <= 7) return 1;
  if (score <= 12) return 2;
  return 3;
}
