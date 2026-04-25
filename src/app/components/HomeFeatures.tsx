"use client";

import { motion } from "motion/react";
import { RotateCcw, Shield, Truck, type LucideIcon } from "lucide-react";
import type { ResolvedStorefrontHomeCopy } from "@/lib/storefront-copy";

interface Feature {
  readonly icon: LucideIcon;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

const FEATURE_ICONS: readonly LucideIcon[] = [Truck, Shield, RotateCcw];

const EASE = [0.19, 1, 0.22, 1] as const;

interface HomeFeaturesProps {
  readonly features: ResolvedStorefrontHomeCopy["features"];
}

export function HomeFeatures({ features }: HomeFeaturesProps) {
  const resolvedFeatures: readonly Feature[] = features.map((feature, index) => ({
    ...feature,
    icon: FEATURE_ICONS[index] ?? RotateCcw,
  }));

  return (
    <section className="border-y border-[var(--mist)] bg-[var(--paper)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 divide-y divide-[var(--mist)] md:grid-cols-3 md:divide-x md:divide-y-0">
          {resolvedFeatures.map((feature, idx) => (
            <FeatureCell key={feature.title} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCell({
  feature,
  index,
}: {
  readonly feature: Feature;
  readonly index: number;
}) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
      className="group relative flex flex-col gap-6 px-2 py-10 md:px-10 md:py-14"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-[var(--ink)]/15 text-[var(--ink)] transition-all group-hover:-rotate-6 group-hover:ring-[var(--tenant-primary)]">
          <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
        </div>
        <span className="eyebrow">{feature.eyebrow}</span>
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-[1.7rem] leading-tight tracking-[-0.02em] text-[var(--ink)]">
          <em className="italic font-[430]">{feature.title}</em>
        </h3>
        <p className="max-w-sm text-[0.95rem] leading-relaxed text-[var(--ink)]/70">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}
