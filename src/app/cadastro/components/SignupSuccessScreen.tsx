import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

const EASE = [0.19, 1, 0.22, 1] as const;

interface Props {
  readonly email: string;
}

export function SignupSuccessScreen({ email }: Props) {
  return (
    <section className="relative min-h-[calc(100vh-var(--header-height,0px))] overflow-hidden bg-[var(--paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "var(--tenant-primary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-[10%] h-[340px] w-[340px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--tenant-secondary)" }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-start gap-10 px-6 pt-24 pb-28 md:pt-32 md:pb-36 lg:px-10">
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tenant-primary)] text-white"
        >
          <Check className="h-5 w-5" aria-hidden />
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="space-y-8"
        >
          <span className="eyebrow">Cadastro · confirmado</span>
          <h1
            className="editorial-display text-[clamp(2.6rem,7vw,5rem)] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            Conta <em className="italic">criada</em>.
            <br />
            Falta um passo.
          </h1>
          <p className="max-w-xl text-[1.02rem] leading-relaxed text-[var(--ink)]/75">
            Enviamos um link de verificação para{" "}
            <span className="font-mono text-[0.95rem] text-[var(--ink)]">
              {email}
            </span>
            . Confirme seu email para acessar todos os recursos da loja —
            pedidos, favoritos e pagamentos sem atrito.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/login" className="btn-ink group">
            Ir para entrar
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/" className="btn-ghost">
            Continuar navegando
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
