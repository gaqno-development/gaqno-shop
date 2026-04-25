"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Tag,
} from "lucide-react";
import { useCart, type CartItem } from "@/contexts/cart-context";
import { resolveAssetUrl } from "@/lib/api";
import { formatBRL, formatFreightOrFree } from "@/lib/formatters";

const EASE = [0.19, 1, 0.22, 1] as const;

export default function CartPage() {
  const { cart, removeItem, updateQuantity, isCartMutating } = useCart();
  const [couponCode, setCouponCode] = useState("");

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  const shippingCost = 0;
  const discount = 0;
  const total = cart.subtotal + shippingCost - discount;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-20">
      <CartHeader itemCount={cart.itemCount} />

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
        <div>
          <ul className="divide-y divide-[var(--mist)] border-y border-[var(--mist)]">
            <AnimatePresence initial={false}>
              {cart.items.map((item) => (
                <CartLine
                  key={item.productId}
                  item={item}
                  disabled={isCartMutating}
                  onRemove={() => void removeItem(item.productId)}
                  onQuantity={(q) => void updateQuantity(item.productId, q)}
                />
              ))}
            </AnimatePresence>
          </ul>
          <Link
            href="/produtos"
            className="link-underline mt-10 inline-flex font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← Continuar comprando
          </Link>
        </div>

        <OrderSummary
          subtotal={cart.subtotal}
          shippingCost={shippingCost}
          discount={discount}
          total={total}
          couponCode={couponCode}
          onCouponChange={setCouponCode}
        />
      </div>
    </div>
  );
}

function CartHeader({ itemCount }: { readonly itemCount: number }) {
  return (
    <header className="space-y-6 border-b border-[var(--mist)] pb-10">
      <span className="eyebrow">Carrinho</span>
      <div className="flex items-end justify-between gap-8">
        <h1
          className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] tracking-[-0.035em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          Sua <em className="italic">seleção</em>.
        </h1>
        <span className="font-mono tabular text-sm text-[var(--muted)]">
          {itemCount.toString().padStart(2, "0")}{" "}
          {itemCount === 1 ? "item" : "itens"}
        </span>
      </div>
    </header>
  );
}

function CartLine({
  item,
  disabled,
  onRemove,
  onQuantity,
}: {
  readonly item: CartItem;
  readonly disabled: boolean;
  readonly onRemove: () => void;
  readonly onQuantity: (q: number) => void;
}) {
  const imageUrl =
    resolveAssetUrl(item.imageUrl ?? null) ?? "/placeholder-product.png";
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, height: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="grid grid-cols-[96px_1fr_auto] items-center gap-6 py-8 md:grid-cols-[120px_1fr_auto_auto] md:gap-8"
    >
      <Link
        href={`/produto/${item.productId}`}
        className="block overflow-hidden ring-1 ring-[var(--mist)]"
        style={{ aspectRatio: "4 / 5" }}
      >
        <img
          src={imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-product.png";
          }}
        />
      </Link>

      <div className="min-w-0 space-y-1">
        <Link
          href={`/produto/${item.productId}`}
          className="block font-display text-[1.3rem] leading-tight tracking-[-0.01em] text-[var(--ink)] hover:text-[var(--tenant-primary)]"
        >
          {item.name}
        </Link>
        {item.attributes && Object.entries(item.attributes).length > 0 && (
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            {Object.entries(item.attributes)
              .map(([k, v]) => `${k} · ${v}`)
              .join("  /  ")}
          </p>
        )}
        <p className="font-mono tabular text-[0.95rem] text-[var(--ink)]">
          {formatBRL(item.price)}
          <span className="mx-2 text-[var(--muted)]">·</span>
          <span className="text-[var(--muted)]">unidade</span>
        </p>
      </div>

      <div className="flex items-center rounded-full border border-[var(--mist)]">
        <QtyBtn
          disabled={disabled}
          onClick={() => onQuantity(Math.max(0, item.quantity - 1))}
          aria="Diminuir"
        >
          <Minus className="h-3.5 w-3.5" />
        </QtyBtn>
        <span className="font-mono tabular w-8 text-center text-sm text-[var(--ink)]">
          {item.quantity}
        </span>
        <QtyBtn
          disabled={disabled}
          onClick={() => onQuantity(item.quantity + 1)}
          aria="Aumentar"
        >
          <Plus className="h-3.5 w-3.5" />
        </QtyBtn>
      </div>

      <div className="flex items-center gap-5 md:flex-col md:items-end md:gap-3">
        <motion.span
          key={item.total}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono tabular text-[1.2rem] text-[var(--ink)]"
        >
          {formatBRL(item.total)}
        </motion.span>
        <button
          type="button"
          disabled={disabled}
          onClick={onRemove}
          aria-label="Remover"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--tenant-primary)]/10 hover:text-[var(--tenant-primary)] disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.li>
  );
}

function QtyBtn({
  disabled,
  onClick,
  aria,
  children,
}: {
  readonly disabled: boolean;
  readonly onClick: () => void;
  readonly aria: string;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={aria}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] disabled:opacity-40"
    >
      {children}
    </button>
  );
}

interface SummaryProps {
  readonly subtotal: number;
  readonly shippingCost: number;
  readonly discount: number;
  readonly total: number;
  readonly couponCode: string;
  readonly onCouponChange: (next: string) => void;
}

function OrderSummary({
  subtotal,
  shippingCost,
  discount,
  total,
  couponCode,
  onCouponChange,
}: SummaryProps) {
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
          <SummaryRow label="Subtotal" value={formatBRL(subtotal)} />
          <SummaryRow
            label="Frete"
            value={formatFreightOrFree(shippingCost)}
          />
          {discount > 0 && (
            <SummaryRow
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

        <div className="mt-8 flex items-center gap-2 rounded-full border border-[var(--mist)] px-4 py-2">
          <Tag className="h-3.5 w-3.5 text-[var(--muted)]" strokeWidth={1.5} />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => onCouponChange(e.target.value)}
            placeholder="Código do cupom"
            className="flex-1 bg-transparent font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
          />
          <button className="link-underline font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink)]">
            Aplicar
          </button>
        </div>

        <Link
          href="/checkout"
          className="btn-ink group mt-8 w-full justify-center"
          style={{ borderRadius: "9999px" }}
        >
          Finalizar compra
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          Frete grátis acima de R$ 199
        </p>
      </div>
    </aside>
  );
}

function SummaryRow({
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

function EmptyCart() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full ring-1 ring-[var(--mist)]">
        <ShoppingBag
          className="h-9 w-9 text-[var(--muted)]"
          strokeWidth={1.2}
        />
      </div>
      <span className="eyebrow mt-10 block">Carrinho</span>
      <h1
        className="mt-5 font-display text-[clamp(3rem,7vw,5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
      >
        <em className="italic">Nada por aqui</em>, ainda.
      </h1>
      <p className="mx-auto mt-6 max-w-md text-[0.98rem] leading-relaxed text-[var(--muted)]">
        Você ainda não escolheu nenhuma peça. Vamos encontrar algo que combine
        com você.
      </p>
      <Link href="/produtos" className="btn-ink group mx-auto mt-10 inline-flex">
        Explorar produtos
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
