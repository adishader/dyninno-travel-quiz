import type { ReactNode } from "react";

// Main content container per CLAUDE.md — mobile-first, `desktop:` (1025px+)
// override:
//   Mobile:  width 100%, max-width 580px,  side padding 24px
//   Desktop: width 100%, max-width 1280px, side padding 42px
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[580px] px-[24px] desktop:max-w-[1280px] desktop:px-[42px] ${className}`}>
      {children}
    </div>
  );
}
