"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import type { ResolvedStorefrontHomeCopy } from "@/lib/storefront-copy";

type Status = "idle" | "loading" | "success";

interface HomeNewsletterProps {
  readonly copy: ResolvedStorefrontHomeCopy["newsletter"];
}

export function HomeNewsletter({ copy }: HomeNewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 900);
  };

  return (
    <section className="relative overflow-hidden bg-[var(--paper)] text-[var(--paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full opacity-[0.35] blur-3xl"
        style={{ background: "var(--tenant-primary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 h-[420px] w-[420px] rounded-full opacity-[0.25] blur-3xl"
        style={{ background: "var(--tenant-secondary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[var(--glass-surface)] backdrop-blur-sm"
      />

      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center lg:px-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="eyebrow text-white/60"
        >
          {copy.eyebrow}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="mt-6 font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.95] tracking-[-0.03em]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          {copy.titlePrefix} <em className="italic">{copy.titleItalic}</em>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-6 max-w-lg text-[1rem] leading-relaxed text-white/70"
        >
          {copy.body}
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-12 flex max-w-lg items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-surface)] p-1.5 backdrop-blur-xl"
        >
          <label className="flex-1">
            <span className="sr-only">{copy.emailSrLabel}</span>
            <input
              type="email"
              required
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full bg-transparent px-5 py-3 font-mono text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--paper)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition-all hover:scale-[1.02] disabled:opacity-60"
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "idle" && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-2"
                >
                  {copy.idleLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </motion.span>
              )}
              {status === "loading" && (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {copy.loadingLabel}
                </motion.span>
              )}
              {status === "success" && (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {copy.successLabel}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.form>

        <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/40">
          {copy.footnote}
        </p>
      </div>
    </section>
  );
}
