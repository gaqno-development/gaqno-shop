import { formatCurrency } from "@/lib/utils";
import { formatFreightOrFree } from "@/lib/formatters";
import type { OrderCustomer, OrderDetail } from "@/types/order";

interface Props {
  readonly order: OrderDetail;
}

export function OrderSummaryCard({ order }: Props) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="border border-[var(--mist)] bg-[var(--paper)] p-8">
        <span className="eyebrow">Resumo · recibo</span>
        <h2
          className="mt-4 font-display text-3xl leading-tight tracking-[-0.02em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          <em className="italic font-[430]">Pedido.</em>
        </h2>

        <div className="mt-8 space-y-3 font-mono text-[0.85rem] text-[var(--ink)]">
          <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
          <SummaryRow
            label="Frete"
            value={formatFreightOrFree(order.shippingAmount)}
          />
          {order.taxAmount > 0 ? (
            <SummaryRow
              label="Impostos"
              value={formatCurrency(order.taxAmount)}
            />
          ) : null}
          {order.discountAmount > 0 ? (
            <SummaryRow
              label="Desconto"
              value={`− ${formatCurrency(order.discountAmount)}`}
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
            {formatCurrency(order.total)}
          </span>
        </div>

        <div className="mt-10 border-t border-[var(--mist)] pt-6">
          <span className="eyebrow">Cliente</span>
          <CustomerInfo customer={order.customer} />
        </div>
      </div>
    </aside>
  );
}

interface RowProps {
  readonly label: string;
  readonly value: string;
  readonly tone?: string;
}

function SummaryRow({ label, value, tone }: RowProps) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </span>
      <span className={`tabular ${tone ?? "text-[var(--ink)]"}`}>{value}</span>
    </div>
  );
}

function CustomerInfo({ customer }: { readonly customer: OrderCustomer }) {
  return (
    <div className="mt-4 space-y-1 text-[0.92rem] leading-relaxed text-[var(--ink)]/75">
      <p
        className="font-display text-[1.1rem] italic text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
      >
        {customer.firstName} {customer.lastName}
      </p>
      <p className="font-mono text-[0.72rem] tracking-[0.04em]">
        {customer.email}
      </p>
      {customer.phone ? (
        <p className="font-mono text-[0.72rem] tracking-[0.04em]">
          {customer.phone}
        </p>
      ) : null}
    </div>
  );
}
