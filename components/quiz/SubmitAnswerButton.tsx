export type SubmitButtonVariant = "disabled" | "enabled" | "feedback-correct" | "feedback-wrong";

// Disabled/Enabled/Feedback-Wrong all use tokenized colors (fill-grey-light,
// fill-yellow); Feedback-Correct's #66b11b is a literal from the Question /
// Correct Answer Figma frame, not in trevo-design-tokens.tokens.json.
const variantClasses: Record<SubmitButtonVariant, string> = {
  disabled: "cursor-not-allowed bg-fill-grey-light text-text-primary",
  enabled: "cursor-pointer bg-fill-yellow text-text-primary hover:bg-[#F2C124]",
  "feedback-correct": "cursor-default bg-[#66b11b] text-text-white",
  "feedback-wrong": "cursor-default bg-fill-grey-light text-text-primary",
};

export function SubmitAnswerButton({
  variant,
  disabled,
  onClick,
  children,
}: {
  variant: SubmitButtonVariant;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[56px] w-full items-center justify-center gap-[6px] rounded-[18px] px-[18px] text-center text-mobile-body-regular-bold transition-colors duration-300 ease-out desktop:h-[74px] desktop:gap-[10px] desktop:rounded-[24px] desktop:px-[24px] desktop:text-desktop-body-regular-bold ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
