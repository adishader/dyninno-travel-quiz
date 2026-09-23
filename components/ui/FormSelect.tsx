"use client";

import { useState, type ReactNode, type SelectHTMLAttributes } from "react";

// Same Default/Active/Filled/Error visual states as FormInput, from the same
// Design System Input component (the Company office field reuses the Input
// shell with a trailing chevron per the Quiz-Finish Figma frame) — NOT the
// separate "Dropdown" component (that's a heavier custom listbox pattern
// used elsewhere in the design system, with its own open/hover-per-item
// menu). A native <select> can't reproduce that custom open-menu styling
// (the browser renders its own listbox), so CLAUDE.md's "Open" dropdown
// state is not visually reproduced here — traded for native keyboard/a11y/
// mobile support on a plain 10-option field, flagged rather than guessed.
type SelectVisualState = "default" | "active" | "filled" | "error";

const stateClasses: Record<SelectVisualState, string> = {
  default: "border-transparent bg-fill-grey-pale text-text-secondary",
  active: "border-border-dark bg-fill-white text-text-primary",
  filled: "border-transparent bg-fill-grey-pale text-text-primary",
  error: "border-[#fa3737] bg-fill-grey-pale text-text-secondary",
};

export function FormSelect({
  error,
  className = "",
  onFocus,
  onBlur,
  children,
  ...rest
}: { error?: boolean; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false);
  const hasValue = typeof rest.value === "string" && rest.value.length > 0;
  const state: SelectVisualState = error ? "error" : focused ? "active" : hasValue ? "filled" : "default";

  return (
    <div className="relative w-full">
      <select
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={`h-[56px] w-full appearance-none rounded-[18px] border-2 px-[18px] pr-[48px] text-mobile-body-regular outline-none transition-colors duration-300 ease-out desktop:h-[74px] desktop:rounded-[24px] desktop:px-[24px] desktop:pr-[56px] desktop:text-desktop-body-regular ${stateClasses[state]} ${className}`}
      >
        {children}
      </select>
      {/* eslint-disable-next-line @next/next/no-img-element -- small static icon, not a Next/Image candidate */}
      <img
        src="/images/other/ic-chevron-bottom.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[18px] top-1/2 size-[24px] -translate-y-1/2 desktop:right-[24px]"
      />
    </div>
  );
}
