interface Props {
  readonly description: string | null;
}

export function ProductDescription({ description }: Props) {
  if (!description) return null;
  return (
    <section className="mt-24 border-t border-[var(--mist)] pt-16">
      <span className="eyebrow">Sobre a peça</span>
      <h2
        className="mt-4 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight tracking-[-0.025em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
      >
        <em className="italic font-[430]">Descrição.</em>
      </h2>
      <div className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-[var(--ink)]/80 whitespace-pre-wrap">
        {description}
      </div>
    </section>
  );
}
