"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { GoogleIcon } from "./components/GoogleIcon";

const EASE = [0.19, 1, 0.22, 1] as const;

type LoginError =
  | ""
  | "invalid-credentials"
  | "google-failed"
  | "oauth-signin"
  | "oauth-callback"
  | "configuration"
  | "access-denied"
  | "account-not-linked"
  | "unknown";

const ERROR_COPY: Record<Exclude<LoginError, "">, string> = {
  "invalid-credentials": "Email ou senha não conferem.",
  "google-failed": "Não conseguimos concluir com Google. Tente de novo ou use email.",
  "oauth-signin": "Não foi possível iniciar o login com Google. Verifique as configurações do site ou tente mais tarde.",
  "oauth-callback": "O retorno do Google falhou. Tente novamente ou use email.",
  configuration: "Login com Google não está configurado corretamente no servidor.",
  "access-denied": "Acesso cancelado ou negado no Google.",
  "account-not-linked": "Esta conta Google não está vinculada. Entre com email ou crie uma conta.",
  unknown: "Algo deu errado. Tente novamente.",
};

const NEXT_AUTH_ERROR_TO_LOGIN: Record<string, LoginError> = {
  OAuthSignin: "oauth-signin",
  OAuthCallback: "oauth-callback",
  OAuthCreateAccount: "oauth-callback",
  Callback: "oauth-callback",
  Configuration: "configuration",
  AccessDenied: "access-denied",
  Verification: "oauth-callback",
  OAuthAccountNotLinked: "account-not-linked",
  EmailCreateAccount: "oauth-callback",
  SessionRequired: "google-failed",
  Default: "google-failed",
};

function loginErrorFromNextAuthCode(code: string | null): LoginError {
  if (!code) return "";
  return NEXT_AUTH_ERROR_TO_LOGIN[code] ?? "google-failed";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/conta";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<LoginError>("");
  const urlError = loginErrorFromNextAuthCode(searchParams.get("error"));
  const shownError = localError || urlError;

  async function handleCredentialsSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setCredentialsLoading(true);
    setLocalError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setLocalError("invalid-credentials");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setLocalError("unknown");
    } finally {
      setCredentialsLoading(false);
    }
  }

  async function handleGoogleSignIn(): Promise<void> {
    setGoogleLoading(true);
    setLocalError("");
    try {
      const result = await signIn("google", { callbackUrl, redirect: false });
      if (result?.error) {
        setLocalError(loginErrorFromNextAuthCode(result.error));
        return;
      }
      if (result?.url) {
        window.location.assign(result.url);
        return;
      }
      setLocalError("google-failed");
    } catch {
      setLocalError("google-failed");
    } finally {
      setGoogleLoading(false);
    }
  }

  const isBusy = credentialsLoading || googleLoading;

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
          <span className="eyebrow mb-8">Acesso · entrar</span>
          <h1
            className="editorial-display text-[clamp(2.6rem,7vw,5rem)] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 90' }}
          >
            Bem-vindo
            <br />
            <em className="italic">de volta.</em>
          </h1>
          <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-[var(--ink)]/75">
            Entre com a sua conta para acompanhar pedidos, favoritos e dados de
            entrega. Sem fricção, sem espera.
          </p>
          <Link
            href="/"
            className="link-underline mt-10 inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
            Voltar à loja
          </Link>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="relative flex flex-col justify-center"
        >
          <div className="rounded-sm bg-[var(--paper)] p-8 ring-1 ring-[var(--mist)] shadow-[0_30px_60px_-40px_rgba(0,0,0,0.2)]">
            <span className="eyebrow">Formulário · 01</span>

            <AnimatePresence>
              {shownError ? (
                <motion.p
                  key={shownError}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-red-700"
                >
                  {ERROR_COPY[shownError]}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isBusy}
              whileTap={{ scale: 0.98 }}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-sm border border-[var(--mist)] bg-transparent px-4 py-3 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--ink)] transition-colors duration-300 hover:border-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Aguarde
                </>
              ) : (
                <>
                  <GoogleIcon className="h-5 w-5" aria-hidden />
                  Continuar com Google
                </>
              )}
            </motion.button>

            <div
              aria-hidden
              className="my-8 flex items-center gap-4 font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--muted)]"
            >
              <span className="h-px flex-1 bg-[var(--mist)]" />
              ou com email
              <span className="h-px flex-1 bg-[var(--mist)]" />
            </div>

            <form onSubmit={handleCredentialsSubmit} noValidate className="space-y-6">
              <div>
                <label
                  htmlFor="login-email"
                  className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--muted)]"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@dominio.com"
                  className="mt-3 w-full border-0 border-b border-[var(--mist)] bg-transparent pb-3 font-display text-xl italic text-[var(--ink)] outline-none transition-colors duration-300 focus:border-[var(--ink)]"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--muted)]"
                >
                  Senha
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="mt-3 w-full border-0 border-b border-[var(--mist)] bg-transparent pb-3 font-display text-xl italic text-[var(--ink)] outline-none transition-colors duration-300 focus:border-[var(--ink)]"
                />
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/recuperar-senha"
                  className="link-underline font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={isBusy}
                whileTap={{ scale: 0.98 }}
                className="btn-ink group w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {credentialsLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Entrando
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-8 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              Sem conta ainda?{" "}
              <Link href="/cadastro" className="link-underline text-[var(--ink)]">
                Criar uma
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--paper)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--ink)]" aria-hidden />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
