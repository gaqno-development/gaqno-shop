"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Award, Heart, Package, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const EASE = [0.19, 1, 0.22, 1] as const;

interface Stat {
  readonly index: string;
  readonly label: string;
  readonly value: string;
  readonly icon: typeof Package;
  readonly href: string;
}

const STATS: readonly Stat[] = [
  {
    index: "01",
    label: "Pedidos",
    value: "00",
    icon: Package,
    href: "/conta/pedidos",
  },
  {
    index: "02",
    label: "Favoritos",
    value: "00",
    icon: Heart,
    href: "/conta/lista-desejos",
  },
  {
    index: "03",
    label: "Pontos",
    value: "00",
    icon: Award,
    href: "/conta/fidelidade",
  },
];

export default function AccountDashboard() {
  return (
    <div className="space-y-16">
      <header className="border-b border-[var(--mist)] pb-10">
        <span className="eyebrow">Painel · visão geral</span>
        <h1
          className="mt-4 font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          Seu <em className="italic">espaço</em>.
        </h1>
        <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-[var(--ink)]/75">
          Aqui você acompanha pedidos, favoritos e recompensas. Sem ruído,
          apenas o essencial.
        </p>
      </header>

      <section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STATS.map((stat, index) => (
            <StatCard key={stat.index} stat={stat} delay={index * 0.08} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-b border-[var(--mist)] pb-5">
          <span className="eyebrow">Atividade · recente</span>
          <Link
            href="/conta/pedidos"
            className="link-underline font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Ver tudo
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-6 px-6 py-16 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-[var(--mist)]">
            <TrendingUp
              className="h-5 w-5 text-[var(--muted)]"
              strokeWidth={1.2}
            />
          </div>
          <h3
            className="font-display text-2xl italic leading-tight tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            Nada por aqui ainda.
          </h3>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-[var(--muted)]">
            Seus pedidos e atividades aparecerão aqui. Que tal começar
            explorando a seleção?
          </p>
          <Link href="/produtos" className="btn-ink group mt-2">
            Explorar produtos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function StatCard({
  stat,
  delay,
}: {
  readonly stat: Stat;
  readonly delay: number;
}) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      <Link
        href={stat.href}
        className="group flex flex-col justify-between border border-[var(--mist)] bg-[var(--paper)] p-7 transition-colors duration-300 hover:border-[var(--ink)]"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono tabular text-[0.66rem] uppercase tracking-[0.24em] text-[var(--muted)]">
            {stat.index}
          </span>
          <Icon
            className="h-4 w-4 text-[var(--muted)] transition-colors group-hover:text-[var(--ink)]"
            strokeWidth={1.5}
          />
        </div>
        <div className="mt-10 flex items-baseline justify-between">
          <span
            className="font-display text-[2.75rem] leading-none tracking-[-0.03em] text-[var(--ink)] tabular"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
          >
            {stat.value}
          </span>
          <span className="eyebrow">{stat.label}</span>
        </div>
      </Link>
    </motion.div>
  );
}
