import { formatBRL, formatFreightOrFree } from "@/lib/formatters";
import type { AccountOrderDetail } from "../types";

interface Props {
  readonly order: AccountOrderDetail;
}

export function AccountOrderSummaryCard({ order }: Props) {
  const subtotal = Number.parseFloat(order.subtotal);
  const shipping = Number.parseFloat(order.shippingAmount);
  const discount = Number.parseFloat(order.discountAmount);
  const total = Number.parseFloat(order.total);

  return (
    <section className="glass-card p-8">
      <span className="eyebrow">Resumo · recibo</span>
      <h2
        className="mt-4 font-display text-3xl leading-tight tracking-[-0.02em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
      >
        <em className="italic font-[430]">Pedido.</em>
      </h2>

      <div className="mt-8 space-y-3 font-mono text-[0.85rem] text-[var(--ink)]">
        <Row label="Subtotal" value={formatBRL(subtotal)} />
        <Row label="Frete" value={formatFreightOrFree(shipping)} />
        {discount > 0 ? (
          <Row
            label="Desconto"
            value={`− ${formatBRL(discount)}`}
            tone="text-emerald-700"
          />
        ) : null}
      </div>

      <div
        aria-hidden
        className="my-8 h-px w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg, var(--ink) 0 4px, transparent 4px 10px)",
        }}
      />

      <div className="flex items-baseline justify-between">
        <span className="eyebrow">Total</span>
        <span className="font-mono tabular text-3xl text-[var(--ink)]">
          {formatBRL(total)}
        </span>
      </div>

      <p className="mt-8 font-mono text-[0.64rem] uppercase tracking-[0.22em] text-[var(--muted)]">
        Pagamento · {order.paymentMethod || "—"}
      </p>
    </section>
  );
}

interface RowProps {
  readonly label: string;
  readonly value: string;
  readonly tone?: string;
}

function Row({ label, value, tone }: RowProps) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </span>
      <span className={`tabular ${tone ?? "text-[var(--ink)]"}`}>{value}</span>
    </div>
  );
}
