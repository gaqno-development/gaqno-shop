"use client";

import { motion } from "motion/react";
import { Minus, Plus, ShoppingBag } from "lucide-react";

interface Props {
  readonly quantity: number;
  readonly onDecrement: () => void;
  readonly onIncrement: () => void;
  readonly canIncrement: boolean;
  readonly isOutOfStock: boolean;
  readonly isAddingToCart: boolean;
  readonly onAddToCart: () => void;
}

export function ProductPurchaseControls({
  quantity,
  onDecrement,
  onIncrement,
  canIncrement,
  isOutOfStock,
  isAddingToCart,
  onAddToCart,
}: Props) {
  const buttonLabel = isAddingToCart
    ? "Adicionando…"
    : isOutOfStock
      ? "Indisponível"
      : "Adicionar ao carrinho";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
      <div className="flex items-center rounded-full border border-[var(--glass-border)]">
        <IconBtn onClick={onDecrement} disabled={isOutOfStock} aria="Diminuir">
          <Minus className="h-4 w-4" />
        </IconBtn>
        <span className="font-mono tabular w-10 text-center text-sm text-[var(--ink)]">
          {quantity}
        </span>
        <IconBtn
          onClick={onIncrement}
          disabled={isOutOfStock || !canIncrement}
          aria="Aumentar"
        >
          <Plus className="h-4 w-4" />
        </IconBtn>
      </div>

      <motion.button
        onClick={onAddToCart}
        disabled={isOutOfStock || isAddingToCart}
        whileTap={{ scale: 0.98 }}
        className="group flex-1 inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-primary-foreground font-mono text-[0.72rem] uppercase tracking-[0.24em] transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingBag className="h-4 w-4 transition-transform group-hover:-rotate-6" />
        {buttonLabel}
      </motion.button>
    </div>
  );
}

function IconBtn({
  onClick,
  disabled,
  aria,
  children,
}: {
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly aria: string;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={aria}
      className="flex h-12 w-12 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--ink)]"
    >
      {children}
    </button>
  );
}
