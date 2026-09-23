// Decorative full-height vertical grid lines shared across screens (Home,
// Start, ... per their Figma frames' `bg-lines` layer). Spacing matches
// each breakpoint's Figma value (mobile gap 230px, desktop gap 407px).
export function BackgroundLines({ zIndexClassName = "z-[1]" }: { zIndexClassName?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 top-0 flex h-full w-full items-start justify-center gap-[230px] desktop:gap-[407px] ${zIndexClassName}`}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <span key={i} className="h-full w-[2px] bg-border-light" />
      ))}
    </div>
  );
}
