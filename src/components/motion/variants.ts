"use client";

import { useReducedMotion, type Variants } from "motion/react";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

export const REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

export const STAGGER_PARENT: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const FADE_IN: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
};

export const SLIDE_RIGHT: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

const STATIC_VARIANT: Variants = {
  hidden: { opacity: 1, y: 0, x: 0 },
  visible: { opacity: 1, y: 0, x: 0 },
};

export function useMotionVariants(variants: Variants): Variants {
  const reduced = useReducedMotion();
  return reduced ? STATIC_VARIANT : variants;
}
