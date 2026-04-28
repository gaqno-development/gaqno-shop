"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";

interface HeaderCartButtonProps {
  readonly itemCount: number;
  readonly onOpen: () => void;
}

export function HeaderCartButton({ itemCount, onOpen }: HeaderCartButtonProps) {
  const showBadge = itemCount > 0;
  const displayCount = itemCount > 9 ? "9+" : String(itemCount);

  return (
    <button
      onClick={onOpen}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] text-[var(--ink)] transition-colors hover:border-[var(--tenant-primary)] hover:bg-[var(--glass-highlight)]"
      aria-label="Abrir carrinho"
    >
      <ShoppingBag
        className="h-[1.1rem] w-[1.1rem] transition-transform group-hover:-rotate-6"
        aria-hidden
      />
      <AnimatePresence mode="wait">
        {showBadge && (
          <motion.span
            key={displayCount}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="font-mono tabular absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-medium text-primary-foreground"
          >
            {displayCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
