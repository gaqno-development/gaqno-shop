interface Props {
  readonly searchQuery: string;
  readonly isLoading: boolean;
  readonly productsCount: number;
}

export function ProductsHeader({ searchQuery, isLoading, productsCount }: Props) {
  const label = searchQuery ? `para "${searchQuery}"` : "completo";
  const statusText = isLoading
    ? "Carregando seleção"
    : `${productsCount} ${productsCount === 1 ? "peça" : "peças"} disponíveis`;

  return (
    <header className="mb-14 space-y-6 border-b border-[var(--mist)] pb-10">
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-[0.68rem] uppercase tracking-[0.26em] text-[var(--muted)]"
      >
        Início / <span className="text-[var(--ink)]">Produtos</span>
      </nav>
      <h1
        className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] tracking-[-0.035em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
      >
        {searchQuery ? (
          <>
            Resultados <em className="italic">{label}</em>
          </>
        ) : (
          <>
            Catálogo <em className="italic">{label}</em>.
          </>
        )}
      </h1>
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[var(--muted)]">
        {statusText}
      </p>
    </header>
  );
}
