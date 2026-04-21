"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/catalog";

interface Props {
  readonly categories: readonly Category[];
}

const EASE = [0.19, 1, 0.22, 1] as const;

export function HomeCategoriesSection({ categories }: Props) {
  if (categories.length === 0) return null;
  const [hero, ...rest] = categories;
  const secondary = rest.slice(0, 3);

  return (
    <section className="bg-[var(--paper)] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-6 lg:h-[640px]">
          <CategoryTile
            category={hero}
            featured
            className="md:col-span-2 md:row-span-2"
          />
          {secondary.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="mb-14 flex items-end justify-between gap-8 border-b border-[var(--mist)] pb-8">
      <div className="space-y-3">
        <span className="eyebrow">Coleções · 2026</span>
        <h2
          className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          Por <em className="italic">categoria</em>.
        </h2>
      </div>
      <Link
        href="/produtos"
        className="link-underline hidden font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[var(--ink)] md:inline-flex"
      >
        Ver tudo
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function CategoryTile({
  category,
  featured,
  className = "",
}: {
  readonly category: Category;
  readonly featured?: boolean;
  readonly className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`group relative overflow-hidden bg-[var(--mist)]/50 ring-1 ring-[var(--mist)] ${className}`}
      style={{ minHeight: featured ? undefined : 220 }}
    >
      <Link href={`/produtos?category=${category.slug}`} className="block h-full">
        {category.imageUrl ? (
          <motion.img
            src={category.imageUrl}
            alt={category.name}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, var(--tenant-secondary), transparent 55%), radial-gradient(circle at 80% 80%, var(--tenant-primary), transparent 60%)",
            }}
          />
        )}

        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            background:
              "linear-gradient(180deg, transparent 45%, var(--tenant-primary) 160%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
          <span className="eyebrow mix-blend-difference text-white/90">
            Coleção
          </span>

          <div className="space-y-3">
            <h3
              className={`font-display leading-[0.95] tracking-[-0.03em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)] ${featured ? "text-[clamp(3rem,6vw,5.5rem)]" : "text-[clamp(1.7rem,3.5vw,2.5rem)]"}`}
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
            >
              <em className="italic font-[420]">{category.name}</em>
            </h3>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-white/80"
            >
              Explorar
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.3 }}
                className="inline-flex"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </motion.span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
