"use client";

import { motion, AnimatePresence } from "motion/react";
import ProductCard from "@/components/product-card";
import type { ProductSummary } from "@/types/catalog";

interface Props {
  readonly products: readonly ProductSummary[];
  readonly isLoading: boolean;
}

const EASE = [0.19, 1, 0.22, 1] as const;

export function ProductsGrid({ products, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div
              className="w-full animate-pulse glass-card"
              style={{ aspectRatio: "4 / 5" }}
            />
            <div className="h-4 w-3/4 animate-pulse bg-[var(--glass-surface)]" />
            <div className="h-3 w-1/3 animate-pulse bg-[var(--glass-surface)]" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3
          className="font-display text-4xl italic leading-tight tracking-[-0.02em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          Nada por aqui.
        </h3>
        <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          Tente ajustar os filtros acima
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
