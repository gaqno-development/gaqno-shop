interface Props {
  readonly isOutOfStock: boolean;
  readonly isLowStock: boolean;
  readonly quantity: number;
}

function StockDot({ tone }: { readonly tone: "ok" | "warn" | "error" }) {
  const color =
    tone === "ok"
      ? "bg-emerald-500"
      : tone === "warn"
        ? "bg-amber-500"
        : "bg-rose-500";
  return (
    <span className="relative flex h-2 w-2" aria-hidden>
      <span
        className={`absolute inset-0 animate-ping rounded-full ${color} opacity-60`}
      />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

export function ProductStockStatus({
  isOutOfStock,
  isLowStock,
  quantity,
}: Props) {
  if (isOutOfStock) {
    return (
      <p className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-rose-600">
        <StockDot tone="error" />
        Esgotado por enquanto
      </p>
    );
  }
  if (isLowStock) {
    return (
      <p className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-amber-700">
        <StockDot tone="warn" />
        Apenas {quantity} {quantity === 1 ? "peça" : "peças"} disponíveis
      </p>
    );
  }
  return (
    <p className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-emerald-700">
      <StockDot tone="ok" />
      Disponível
    </p>
  );
}
