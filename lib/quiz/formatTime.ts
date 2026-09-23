// Formats elapsed seconds as "0m 0s" (e.g. "4m 34s"), per CLAUDE.md's Timer spec.
export function formatElapsed(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}m ${seconds}s`;
}
