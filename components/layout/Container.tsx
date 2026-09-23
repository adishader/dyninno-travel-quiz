import type { ReactNode } from "react";

// Main content container per CLAUDE.md: full-bleed wrapper, Desktop max-width
// 1280px / 42px side padding. Mobile sizing (max-width 580px / 24px padding)
// is added once the Mobile Home frame's node-id is available.
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-[42px] ${className}`}>{children}</div>;
}
