import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Props {
  readonly message: string;
}

export function OrderError({ message }: Props) {
  return (
    <section className="relative min-h-[calc(100vh-var(--header-height,0px))] overflow-hidden bg-[var(--paper)]">
      <div className="relative mx-auto flex max-w-3xl flex-col items-start gap-10 px-6 pt-28 pb-32 lg:px-10">
        <span className="eyebrow">Pedido · 404</span>
        <h1
          className="font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.92] tracking-[-0.035em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 90' }}
        >
          <em className="italic">Nada aqui</em>, ainda.
        </h1>
        <p className="max-w-md text-[1.02rem] leading-relaxed text-[var(--ink)]/75">
          {message}
        </p>
        <Link
          href="/"
          className="link-underline inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Voltar à loja
        </Link>
      </div>
    </section>
  );
}

export function OrderLoadingSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[var(--paper)]">
      <Loader2 className="h-6 w-6 animate-spin text-[var(--tenant-primary)]" aria-hidden />
    </div>
  );
}
