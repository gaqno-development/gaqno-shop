"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { R2_PUBLIC_URL } from "@/lib/api";
import { formatBRL } from "@/lib/formatters";

interface CartDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const BACKDROP = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const PANEL = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, damping: 32, stiffness: 260 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] as const },
  },
};

const ITEM = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20, scale: 0.96 },
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeItem, updateQuantity } = useCart();
  const hasItems = !!cart && cart.items.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            variants={BACKDROP}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[var(--ink)]/30 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            variants={PANEL}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[var(--paper)] shadow-[-40px_0_80px_-40px_rgba(0,0,0,0.35)]"
            aria-label="Carrinho"
          >
            <DrawerHeader itemCount={cart?.itemCount ?? 0} onClose={onClose} />

            <div className="flex-1 overflow-y-auto px-6">
              {!hasItems ? (
                <EmptyState onClose={onClose} />
              ) : (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.04, delayChildren: 0.1 }}
                  className="divide-y divide-[var(--mist)]"
                >
                  <AnimatePresence initial={false}>
                    {cart!.items.map((item) => (
                      <motion.li
                        key={item.productId}
                        layout
                        variants={ITEM}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                        className="flex gap-5 py-6"
                      >
                        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xs ring-1 ring-[var(--mist)] bg-white">
                          <img
                            src={
                              item.imageUrl
                                ? `${R2_PUBLIC_URL}/${item.imageUrl}`
                                : "/placeholder-product.png"
                            }
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-product.png";
                            }}
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-display text-[1.05rem] leading-tight text-[var(--ink)] truncate">
                              {item.name}
                            </h4>
                            {item.attributes &&
                              Object.entries(item.attributes).length > 0 && (
                                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                                  {Object.entries(item.attributes)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(" · ")}
                                </p>
                              )}
                            <p className="font-mono tabular text-[0.95rem] text-[var(--ink)]">
                              {formatBRL(item.price)}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-0 rounded-full border border-[var(--mist)]">
                              <QtyBtn
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    Math.max(0, item.quantity - 1),
                                  )
                                }
                                aria="Diminuir"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </QtyBtn>
                              <span className="font-mono tabular w-8 text-center text-sm text-[var(--ink)]">
                                {item.quantity}
                              </span>
                              <QtyBtn
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity + 1)
                                }
                                aria="Aumentar"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </QtyBtn>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--tenant-primary)]/10 hover:text-[var(--tenant-primary)]"
                              aria-label="Remover"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>

            {hasItems && <DrawerFooter cart={cart!} onClose={onClose} />}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerHeader({
  itemCount,
  onClose,
}: {
  readonly itemCount: number;
  readonly onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--mist)] px-6 py-5">
      <div className="space-y-1">
        <span className="eyebrow">Seu carrinho</span>
        <h2 className="font-display text-2xl leading-none tracking-[-0.02em] text-[var(--ink)]">
          <em className="italic font-[440]">
            {itemCount > 0
              ? `${itemCount} ${itemCount === 1 ? "peça" : "peças"}`
              : "vazio por enquanto"}
          </em>
        </h2>
      </div>
      <button
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--mist)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
        aria-label="Fechar carrinho"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function QtyBtn({
  onClick,
  aria,
  children,
}: {
  readonly onClick: () => void;
  readonly aria: string;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
    >
      {children}
    </button>
  );
}

function EmptyState({ onClose }: { readonly onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full ring-1 ring-[var(--mist)]">
        <ShoppingBag className="h-8 w-8 text-[var(--muted)]" strokeWidth={1.2} />
      </div>
      <h3
        className="mt-8 font-display text-3xl leading-tight tracking-[-0.02em] text-[var(--ink)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
      >
        <em className="italic font-[430]">Seu carrinho aguarda.</em>
      </h3>
      <p className="mt-3 max-w-xs font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--muted)]">
        Escolha peças que ficam com você.
      </p>
      <Link
        href="/produtos"
        onClick={onClose}
        className="btn-ink mt-8 group"
      >
        Explorar produtos
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function DrawerFooter({
  cart,
  onClose,
}: {
  readonly cart: NonNullable<ReturnType<typeof useCart>["cart"]>;
  readonly onClose: () => void;
}) {
  return (
    <div className="border-t border-[var(--mist)] bg-[var(--paper)] px-6 pt-6 pb-8 space-y-5">
      <div className="flex items-baseline justify-between">
        <span className="eyebrow">Subtotal</span>
        <motion.span
          key={cart.subtotal}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono tabular text-2xl text-[var(--ink)]"
        >
          {formatBRL(cart.subtotal)}
        </motion.span>
      </div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)]">
        Frete e impostos calculados no checkout
      </p>
      <Link
        href="/carrinho"
        onClick={onClose}
        className="btn-ink group w-full justify-center"
        style={{ borderRadius: "9999px" }}
      >
        Finalizar compra
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
      <button
        onClick={onClose}
        className="link-underline mx-auto block font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)]"
      >
        Continuar comprando
      </button>
    </div>
  );
}
