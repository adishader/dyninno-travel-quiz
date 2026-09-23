"use client";

import { useState, type InputHTMLAttributes } from "react";

// States: Default (grey-pale/placeholder), Focused=Active (white/border-dark),
// Filled (grey-pale/primary-text, not focused), Error (grey-pale/red border) —
// from the Design System Input component (regular size, text icon).
type InputVisualState = "default" | "active" | "filled" | "error";

const stateClasses: Record<InputVisualState, string> = {
  default: "border-transparent bg-fill-grey-pale text-text-secondary",
  active: "border-border-dark bg-fill-white text-text-primary",
  filled: "border-transparent bg-fill-grey-pale text-text-primary",
  error: "border-[#fa3737] bg-fill-grey-pale text-text-secondary",
};

export function FormInput({
  error,
  className = "",
  onFocus,
  onBlur,
  ...rest
}: { error?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  const hasValue = typeof rest.value === "string" && rest.value.length > 0;
  const state: InputVisualState = error ? "error" : focused ? "active" : hasValue ? "filled" : "default";

  return (
    <input
      {...rest}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      className={`h-[56px] w-full rounded-[18px] border-2 px-[18px] text-mobile-body-regular outline-none transition-colors duration-300 ease-out desktop:h-[74px] desktop:rounded-[24px] desktop:px-[24px] desktop:text-desktop-body-regular ${stateClasses[state]} ${className}`}
    />
  );
}
