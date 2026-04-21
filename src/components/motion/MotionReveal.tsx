"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { REVEAL_VARIANTS, useMotionVariants } from "./variants";

interface MotionRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly as?: "div" | "section" | "article" | "header" | "footer";
  readonly variants?: Variants;
  readonly once?: boolean;
  readonly amount?: number;
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  as = "div",
  variants,
  once = true,
  amount = 0.2,
}: MotionRevealProps) {
  const resolved = useMotionVariants(variants ?? REVEAL_VARIANTS);
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={resolved}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
