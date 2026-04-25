"use client";

import { motion } from "motion/react";
import { Lock, Tag } from "lucide-react";
import { resolveAssetUrl } from "@/lib/api";
import { formatBRL, formatFreightOrFree } from "@/lib/formatters";
import type { CartSummary } from "@/contexts/cart-context";

interface Props {
  readonly cart: CartSummary;
  readonly shippingCost: number;
  readonly discount: number;
  readonly total: number;
  readonly couponCode: string;
  readonly onCouponChange: (value: string) => void;
  readonly onApplyCoupon: () => void;
  readonly isSubmitting: boolean;
  readonly canSubmit: boolean;
  readonly onSubmit: () => void;
}

export function OrderSummary({
  cart,
  shippingCost,
  discount,
  total,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  isSubmitting,
  canSubmit,
  onSubmit,
}: Props) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="border border-[var(--mist)] bg-[var(--paper)] p-8">
        <span className="eyebrow">Resumo</span>
        <h2
          className="mt-4 font-display text-3xl leading-tight tracking-[-0.02em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          <em className="italic font-[430]">Seu pedido.</em>
        </h2>

        <ul className="mt-8 max-h-72 space-y-5 overflow-y-auto pr-1">
          {cart.items.map((item) => (
            <li key={item.productId} className="flex gap-4">
              <div
                className="flex-shrink-0 overflow-hidden ring-1 ring-[var(--mist)]"
                style={{ width: 56, aspectRatio: "4 / 5" }}
              >
                <img
                  referrerPolicy="no-referrer"
                  src={
                    resolveAssetUrl(item.imageUrl ?? null) ??
                    "/placeholder-product.png"
                  }
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[0.95rem] leading-snug text-[var(--ink)]">
                  {item.name}
                </p>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Qtd · {item.quantity}
                </p>
                <p className="font-mono tabular mt-1 text-[0.82rem] text-[var(--ink)]">
                  {formatBRL(item.total)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center gap-2 rounded-full border border-[var(--mist)] px-4 py-2">
          <Tag className="h-3.5 w-3.5 text-[var(--muted)]" strokeWidth={1.5} />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => onCouponChange(e.target.value)}
            placeholder="Código do cupom"
            className="flex-1 bg-transparent font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
          />
          <button
            onClick={onApplyCoupon}
            className="link-underline font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink)]"
          >
            Aplicar
          </button>
        </div>

        <div className="mt-8 space-y-3 font-mono text-[0.85rem]">
          <Row label="Subtotal" value={formatBRL(cart.subtotal)} />
          <Row label="Frete" value={formatFreightOrFree(shippingCost)} />
          {discount > 0 && (
            <Row
              label="Desconto"
              value={`− ${formatBRL(discount)}`}
              emphasize
            />
          )}
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
          <motion.span
            key={total}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono tabular text-3xl text-[var(--ink)]"
          >
            {formatBRL(total)}
          </motion.span>
        </div>

        <motion.button
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmit}
          whileTap={{ scale: 0.98 }}
          className="group mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--ink)] px-6 py-4 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[var(--paper)] transition-all hover:bg-[var(--tenant-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
          {isSubmitting ? "Processando…" : "Finalizar compra"}
        </motion.button>
        <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          Pagamento criptografado · SSL
        </p>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  emphasize,
}: {
  readonly label: string;
  readonly value: string;
  readonly emphasize?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[var(--muted)] uppercase tracking-[0.18em] text-[0.65rem]">
        {label}
      </span>
      <span
        className={`tabular ${emphasize ? "text-emerald-700" : "text-[var(--ink)]"}`}
      >
        {value}
      </span>
    </div>
  );
}
