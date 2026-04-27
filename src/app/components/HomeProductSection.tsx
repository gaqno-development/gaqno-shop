"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import type { ProductSummary } from "@/types/catalog";

interface Props {
  readonly title: string;
  readonly eyebrow?: string;
  readonly products: readonly ProductSummary[];
  readonly backgroundClassName?: string;
  readonly hideWhenEmpty?: boolean;
}

const EASE = [0.19, 1, 0.22, 1] as const;

export function HomeProductSection({
  title,
  eyebrow = "Seleção",
  products,
  backgroundClassName = "",
  hideWhenEmpty = false,
}: Props) {
  if (hideWhenEmpty && products.length === 0) return null;

  return (
    <section className={`py-24 ${backgroundClassName}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex items-end justify-between gap-8 border-b border-[var(--glass-border)] pb-8">
          <div className="space-y-3">
            <span className="eyebrow">{eyebrow}</span>
            <h2
              className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
            >
              <em className="italic font-[420]">{title}</em>.
            </h2>
          </div>
          <Link
            href="/produtos"
            className="link-underline font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[var(--ink)]"
          >
            Ver todos
            <ArrowUpRight className="h-3.5 w-3.5 text-[var(--tenant-primary)]" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-8 lg:grid-cols-4"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: EASE },
                },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
