import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

// Default/Hover states only, from the Home CTA (Quiz-Home Desktop + Mobile
// frames) and CLAUDE.md's Button states override (hover bg #F2C124).
// Disabled/Loading styling isn't confirmed against Figma yet — add it when
// Start/Submit/Check-Result buttons pull the Design System Button states link.
//
// Shape (size/padding/radius) is left to the caller's className since it
// differs by breakpoint; this only carries the shared interaction/color behavior.
const behaviorClasses =
  "inline-flex cursor-pointer items-center justify-center bg-fill-yellow text-text-primary transition-colors duration-300 ease-out hover:bg-[#F2C124]";

export function LinkButton({
  href,
  children,
  className = "",
  ...rest
}: { href: string; children: ReactNode; className?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={`${behaviorClasses} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${behaviorClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
}
