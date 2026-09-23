// Colors here (#fff3cc/#c2f291/#66b11b/#ffd9d9/#cc5252) come directly from the
// Question UI-states Figma frames (Default/Active-Hover/Correct/Wrong) and
// aren't present in trevo-design-tokens.tokens.json — used as literal values
// to match Figma exactly per CLAUDE.md, not silently mapped to a near token.
export type AnswerOptionState = "default" | "selected" | "correct" | "wrong";

const stateClasses: Record<AnswerOptionState, string> = {
  default: "cursor-pointer border-border-dark bg-fill-white hover:border-fill-yellow hover:bg-[#fff3cc]",
  selected: "cursor-pointer border-fill-yellow bg-[#fff3cc]",
  correct: "cursor-default border-[#66b11b] bg-[#c2f291]",
  wrong: "cursor-default border-[#cc5252] bg-[#ffd9d9]",
};

export function AnswerOption({
  state,
  disabled,
  onClick,
  children,
}: {
  state: AnswerOptionState;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={state === "selected" || state === "correct" || state === "wrong"}
      className={`flex h-[56px] w-full items-center rounded-[18px] border-2 px-[24px] text-left text-mobile-body-regular-bold text-[#242831] transition-colors duration-300 ease-out desktop:h-[74px] desktop:rounded-[24px] desktop:px-[28px] desktop:text-desktop-body-regular-bold ${stateClasses[state]} ${disabled && state === "default" ? "cursor-default" : ""}`}
    >
      {children}
    </button>
  );
}
