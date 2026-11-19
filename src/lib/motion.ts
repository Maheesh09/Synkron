export const ease = [0.22, 1, 0.36, 1] as const;

/** Shared fade-up used by every landing section. Small distance, plays once. */
export const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease },
} as const;
