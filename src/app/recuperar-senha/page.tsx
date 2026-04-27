"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useForgotPassword } from "./hooks/useForgotPassword";

const EASE = [0.19, 1, 0.22, 1] as const;

export default function ForgotPasswordPage() {
  const { email, status, error, setEmail, submit } = useForgotPassword();

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    await submit();
  }

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

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 pt-20 pb-24 md:pt-28 md:pb-32 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col justify-end"
        >
          <span className="eyebrow mb-8">Acesso · recuperação</span>
          <h1
            className="editorial-display text-[clamp(2.6rem,7vw,5rem)] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 90' }}
          >
            Esqueceu?
            <br />
            <em className="italic">A gente ajuda</em>
            <br />
            você a voltar.
          </h1>
          <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-[var(--ink)]/75">
            Informe o email cadastrado. Enviaremos um link para você redefinir
            sua senha com calma — sem pressa, sem ruído.
          </p>
          <Link
            href="/login"
            className="link-underline mt-10 inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
            Voltar para entrar
          </Link>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="relative flex flex-col justify-center"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <SuccessCard key="success" email={email} />
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-8"
                noValidate
              >
                <span className="eyebrow">Formulário · 01</span>
                <div className="mt-8">
                  <label
                    htmlFor="forgot-email"
                    className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--muted)]"
                  >
                    Email cadastrado
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@dominio.com"
                    className="mt-3 w-full border-0 border-b border-[var(--glass-border)] bg-transparent pb-3 font-display text-xl italic text-[var(--ink)] outline-none transition-colors duration-300 focus:border-[var(--tenant-primary)]"
                  />
                </div>

                <AnimatePresence>
                  {error ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                      className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-red-700"
                    >
                      {error}
                    </motion.p>
                  ) : null}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileTap={{ scale: 0.98 }}
                  className="btn-ink group mt-10 w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Enviando
                    </>
                  ) : (
                    <>
                      Enviar link
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>

                <p className="mt-8 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Sem conta ainda?{" "}
                  <Link href="/cadastro" className="link-underline text-[var(--ink)]">
                    Criar uma
                  </Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function SuccessCard({ email }: { readonly email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="glass-card p-10"
    >
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tenant-primary)] text-white"
      >
        <Check className="h-5 w-5" aria-hidden />
      </motion.span>
      <h2
        className="mt-8 font-display text-4xl italic leading-tight tracking-[-0.02em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
      >
        Verifique seu email.
      </h2>
      <p className="mt-5 text-[1rem] leading-relaxed text-[var(--ink)]/75">
        Se{" "}
        <span className="font-mono text-[0.9rem] text-[var(--ink)]">{email}</span>{" "}
        estiver associado a uma conta, você receberá em instantes um link para
        redefinir sua senha.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/login" className="btn-ghost">
          Voltar para entrar
        </Link>
        <Link href="/" className="btn-ink group">
          Continuar navegando
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
