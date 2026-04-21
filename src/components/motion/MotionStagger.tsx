"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { STAGGER_PARENT, useMotionVariants } from "./variants";

interface MotionStaggerProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly as?: "div" | "section" | "ul" | "ol" | "nav";
  readonly once?: boolean;
  readonly amount?: number;
}

export function MotionStagger({
  children,
  className,
  as = "div",
  once = true,
  amount = 0.15,
}: MotionStaggerProps) {
  const variants = useMotionVariants(STAGGER_PARENT);
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </Component>
  );
}
