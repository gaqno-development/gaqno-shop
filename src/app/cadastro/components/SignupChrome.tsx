import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTenant } from "@/contexts/tenant-context";

const EASE = [0.19, 1, 0.22, 1] as const;

export function SignupHeader() {
  const { tenant } = useTenant();
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex flex-col justify-end"
    >
      <span className="eyebrow mb-8">Acesso · cadastro</span>
      <h1
        className="editorial-display text-[clamp(2.6rem,7vw,5rem)] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 90' }}
      >
        Bem-vindo
        <br />
        <em className="italic">ao novo.</em>
      </h1>
      <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-[var(--ink)]/75">
        Crie sua conta em {tenant?.name ?? "nossa loja"} para acompanhar pedidos,
        salvar favoritos e comprar mais rápido. Sem fricção, sem ruído.
      </p>
      <Link
        href="/"
        className="link-underline mt-10 inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        Voltar à loja
      </Link>
    </motion.header>
  );
}

export function SignupFooter() {
  return (
    <p className="mt-8 text-center font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted)]">
      Já tem uma conta?{" "}
      <Link href="/login" className="link-underline text-[var(--ink)]">
        Entrar
      </Link>
    </p>
  );
}

export function SignupErrorBanner({ message }: { readonly message: string }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          key="signup-error"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="alert"
          className="border-l-2 border-red-700 bg-red-700/5 px-5 py-4 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-red-700"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
