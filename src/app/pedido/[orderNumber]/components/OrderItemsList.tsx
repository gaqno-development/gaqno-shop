import { Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { OrderItem } from "@/types/order";

interface Props {
  readonly items: readonly OrderItem[];
}

export function OrderItemsList({ items }: Props) {
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-[var(--glass-border)] pb-5">
        <span className="eyebrow">Itens · do pedido</span>
        <span className="font-mono tabular text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          {items.length.toString().padStart(2, "0")}
        </span>
      </div>
      <ul className="divide-y divide-[var(--glass-border)]">
        {items.map((item, index) => (
          <li
            key={index}
            className="grid grid-cols-[80px_1fr_auto] items-center gap-6 py-6 md:grid-cols-[96px_1fr_auto_auto] md:gap-8"
          >
            <div
              className="overflow-hidden glass-card"
              style={{ aspectRatio: "4 / 5" }}
            >
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--glass-surface)]">
                  <Package
                    className="h-6 w-6 text-[var(--tenant-primary)]"
                    strokeWidth={1.2}
                  />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p
                className="font-display text-[1.2rem] leading-tight tracking-[-0.01em] text-[var(--ink)]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
              >
                {item.productName}
              </p>
              <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Qtd · {item.quantity.toString().padStart(2, "0")}
              </p>
            </div>

            <span className="hidden font-mono tabular text-sm text-[var(--muted)] md:inline">
              {formatCurrency(item.total / Math.max(1, item.quantity))}
            </span>

            <span className="font-mono tabular text-[1rem] text-[var(--ink)]">
              {formatCurrency(item.total)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
