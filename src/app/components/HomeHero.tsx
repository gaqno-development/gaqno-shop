"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";

const EASE = [0.19, 1, 0.22, 1] as const;

export function HomeHero() {
  const { tenant } = useTenant();
  const name = tenant?.name ?? "nossa casa";
  const description =
    tenant?.description ??
    "Curadoria cuidadosa para o cotidiano. Peças que se tornam parte da história de quem as escolhe.";

  return (
    <section className="relative overflow-hidden bg-[var(--paper)]">
      <BackgroundArt />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pt-16 pb-24 md:pt-24 md:pb-32 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative flex flex-col justify-end"
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="eyebrow mb-8 inline-flex items-center gap-2"
          >
            <Sparkles className="h-3 w-3" aria-hidden />
            Coleção · {new Date().getFullYear()}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.18 }}
            className="editorial-display text-[clamp(3.2rem,9vw,6.5rem)] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 90' }}
          >
            Tudo começa <br />
            <em className="italic">com um gesto</em>
            <br />
            de {" "}
            <span className="relative inline-block">
              cuidado
              <motion.svg
                aria-hidden
                viewBox="0 0 240 16"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 1.1, ease: EASE }}
                className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 11 Q 60 2, 120 8 T 238 6"
                  fill="none"
                  stroke="var(--tenant-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 1.1, ease: EASE }}
                />
              </motion.svg>
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
            className="mt-10 max-w-lg text-[1.05rem] leading-relaxed text-[var(--ink)]/80"
          >
            Bem-vindo à <em className="italic">{name}</em>. {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/produtos" className="btn-ink group">
              Ver produtos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/produtos?ordering=new" className="btn-ghost">
              Novidades
            </Link>
          </motion.div>
        </motion.div>

        <HeroArt />
      </div>
    </section>
  );
}

function BackgroundArt() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[640px] w-[640px] rounded-full opacity-[0.22] blur-3xl"
        style={{ background: "var(--tenant-primary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[12%] h-[360px] w-[360px] rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "var(--tenant-secondary)" }}
      />
    </>
  );
}

function HeroArt() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
      className="relative flex items-center justify-center lg:justify-end"
    >
      <div className="relative w-full max-w-md">
        <motion.div
          animate={{
            rotate: [-2, 1, -2],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="relative aspect-[4/5] overflow-hidden rounded-[3px] ring-1 ring-[var(--mist)]"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, var(--tenant-secondary), transparent 60%), radial-gradient(circle at 70% 80%, var(--tenant-primary), transparent 55%)",
          }}
        >
          <img
            src="/hero-image.jpg"
            alt=""
            className="h-full w-full object-cover mix-blend-multiply opacity-95"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="absolute -bottom-8 -left-8 w-56 rounded-sm bg-[var(--paper)] p-5 ring-1 ring-[var(--mist)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]"
        >
          <span className="eyebrow">Avaliação · 2.4k</span>
          <p
            className="mt-3 font-display text-5xl leading-none tracking-[-0.03em] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            4.<em className="italic">9</em>
          </p>
          <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            clientes recomendam
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
          className="absolute -top-6 -right-6 hidden w-44 rounded-sm bg-[var(--ink)] px-5 py-4 text-[var(--paper)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)] lg:block"
        >
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-white/60">
            Curadoria
          </span>
          <p className="mt-2 font-display text-lg italic leading-tight">
            peças que duram
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
