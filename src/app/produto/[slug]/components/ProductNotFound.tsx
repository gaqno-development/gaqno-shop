import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <span className="eyebrow">Erro 404</span>
      <h1
        className="mt-6 font-display text-[clamp(3.5rem,10vw,7rem)] leading-[0.9] tracking-[-0.035em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
      >
        <em className="italic">Perdida</em> no caminho.
      </h1>
      <p className="mx-auto mt-8 max-w-md text-[1rem] leading-relaxed text-[var(--muted)]">
        O produto que você procura não está mais disponível — ou talvez nunca
        tenha existido. Vamos voltar para o começo.
      </p>
      <Link href="/produtos" className="btn-ink group mx-auto mt-10 inline-flex">
        Ver todos os produtos
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
