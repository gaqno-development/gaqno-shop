import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export function AccountOrderLoadingScreen() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-[var(--ink)]" aria-hidden />
    </div>
  );
}

export function AccountOrderNotFound() {
  return (
    <div className="flex flex-col items-start gap-8 py-12">
      <span className="eyebrow">Pedido · 404</span>
      <h1
        className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
      >
        <em className="italic">Nada aqui</em>.
      </h1>
      <p className="max-w-md text-[1rem] leading-relaxed text-[var(--ink)]/75">
        Não encontramos esse pedido na sua conta. Pode ser que o link esteja
        errado ou ele ainda não foi vinculado.
      </p>
      <Link
        href="/conta/pedidos"
        className="link-underline inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Voltar aos pedidos
      </Link>
    </div>
  );
}
