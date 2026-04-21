"use client";

import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

export function HomeLoadingScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-[var(--muted)]">
          Carregando
        </span>
        <motion.span
          aria-hidden
          className="flex items-center gap-1.5"
          initial="rest"
          animate="pulse"
          variants={{
            rest: {},
            pulse: { transition: { staggerChildren: 0.18 } },
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]"
              variants={{
                rest: { opacity: 0.3 },
                pulse: {
                  opacity: [0.3, 1, 0.3],
                  transition: {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.2, 1],
                  },
                },
              }}
            />
          ))}
        </motion.span>
      </div>
    </div>
  );
}

export function HomeErrorScreen({ message }: { readonly message: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <AlertTriangle
          className="mx-auto mb-8 h-8 w-8 text-[var(--ink)]"
          strokeWidth={1.2}
          aria-hidden
        />
        <span className="eyebrow">Ops · erro</span>
        <h1
          className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)] leading-tight tracking-[-0.03em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          <em className="italic">Algo saiu</em> do trilho.
        </h1>
        <p className="mt-6 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-[var(--muted)]">
          {message}
        </p>
      </div>
    </div>
  );
}
