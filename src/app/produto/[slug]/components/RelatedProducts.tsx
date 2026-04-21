"use client";

import { motion } from "motion/react";
import ProductCard from "@/components/product-card";
import type { ProductSummary } from "@/types/catalog";

interface Props {
  readonly products: readonly ProductSummary[];
}

const EASE = [0.19, 1, 0.22, 1] as const;

export function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="mt-24 border-t border-[var(--mist)] pt-16">
      <div className="mb-12 space-y-3">
        <span className="eyebrow">Combinam com esta peça</span>
        <h2
          className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.03em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          <em className="italic font-[420]">Também vistas.</em>
        </h2>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-4"
      >
        {products.map((related) => (
          <motion.div
            key={related.id}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: EASE },
              },
            }}
          >
            <ProductCard product={related} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
