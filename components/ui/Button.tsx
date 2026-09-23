import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

// Default/Hover states only, from the Home CTA (Quiz-Home Desktop frame) and
// CLAUDE.md's Button states override (hover bg #F2C124). Disabled/Loading
// styling isn't confirmed against Figma yet — add it when Start/Submit/
// Check-Result buttons pull the Design System Button states link directly.
const baseClasses =
  "inline-flex h-[98px] cursor-pointer items-center justify-center rounded-[42px] bg-fill-yellow px-[56px] text-desktop-body-regular-bold text-text-primary transition-colors duration-300 ease-out hover:bg-[#F2C124]";

export function LinkButton({
  href,
  children,
  className = "",
  ...rest
}: { href: string; children: ReactNode; className?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={`${baseClasses} ${className}`} {...rest}>
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
    <button type="button" className={`${baseClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
}
