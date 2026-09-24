import type { Variants } from "framer-motion";

// Page-load stagger fade-in per CLAUDE.md: 600ms, ease-out. Pass an
// increasing `custom` delay (in seconds) to each staggered motion element,
// with `initial="hidden" animate="visible"` set once on their shared ancestor.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};
