"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";

interface Props {
  readonly orderNumber: string;
  readonly email: string;
}

const EASE = [0.19, 1, 0.22, 1] as const;

export function OrderCompleteScreen({ orderNumber, email }: Props) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full blur-3xl opacity-[0.18]"
        style={{ background: "var(--tenant-primary)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 py-32 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="eyebrow"
        >
          Pedido confirmado
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          className="mt-8 font-display text-[clamp(4rem,11vw,8rem)] leading-[0.9] tracking-[-0.035em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          <em className="italic">Obrigada</em>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          className="mx-auto mt-8 max-w-md text-[1rem] leading-relaxed text-[var(--ink)]/75"
        >
          Recebemos seu pedido e logo você recebe o primeiro update por e-mail.
          Enquanto isso, guardamos a caixa com cuidado.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
          className="mx-auto mt-12 grid max-w-sm grid-cols-1 gap-0 divide-y divide-[var(--mist)] border-y border-[var(--mist)] text-left"
        >
          <DetailRow label="Pedido" value={`#${orderNumber}`} />
          <DetailRow label="Confirmação" value={email} icon={Mail} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/" className="btn-ghost">
            Continuar comprando
          </Link>
          <Link
            href={`/conta/pedidos?email=${encodeURIComponent(email)}`}
            className="btn-ink group"
          >
            Ver meus pedidos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  readonly label: string;
  readonly value: string;
  readonly icon?: typeof Mail;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted)]">
        {label}
      </span>
      <span className="flex items-center gap-2 font-mono tabular text-[0.9rem] text-[var(--ink)]">
        {Icon && (
          <Icon className="h-3.5 w-3.5 text-[var(--muted)]" strokeWidth={1.5} />
        )}
        {value}
      </span>
    </div>
  );
}
