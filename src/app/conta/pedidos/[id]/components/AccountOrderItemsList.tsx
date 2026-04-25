import { Package } from "lucide-react";
import { resolveAssetUrl } from "@/lib/api";
import { formatBRL } from "@/lib/formatters";
import type { AccountOrderItem } from "../types";

interface Props {
  readonly items: readonly AccountOrderItem[];
}

export function AccountOrderItemsList({ items }: Props) {
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-[var(--mist)] pb-5">
        <span className="eyebrow">Itens · do pedido</span>
        <span className="font-mono tabular text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          {items.length.toString().padStart(2, "0")}
        </span>
      </div>
      <ul className="divide-y divide-[var(--mist)]">
        {items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function OrderItemRow({ item }: { readonly item: AccountOrderItem }) {
  const src = resolveAssetUrl(item.imageUrl);
  return (
    <li className="grid grid-cols-[80px_1fr_auto] items-center gap-6 py-6 md:grid-cols-[96px_1fr_auto_auto] md:gap-8">
      <div
        className="overflow-hidden ring-1 ring-[var(--mist)]"
        style={{ aspectRatio: "4 / 5" }}
      >
        {src ? (
          <img
            src={src}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--mist)]/30">
            <Package className="h-6 w-6 text-[var(--muted)]" strokeWidth={1.2} />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p
          className="font-display text-[1.2rem] leading-tight tracking-[-0.01em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          {item.name}
        </p>
        <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          Qtd · {item.quantity.toString().padStart(2, "0")}
        </p>
      </div>

      <span className="hidden font-mono tabular text-sm text-[var(--muted)] md:inline">
        {formatBRL(Number.parseFloat(item.price))}
      </span>

      <span className="font-mono tabular text-[1rem] text-[var(--ink)]">
        {formatBRL(Number.parseFloat(item.price) * item.quantity)}
      </span>
    </li>
  );
}
