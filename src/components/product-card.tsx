"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { resolveAssetUrl } from "@/lib/api";
import { formatBRL } from "@/lib/formatters";
import { derivePricing } from "@/lib/pricing";
import type { ProductSummary } from "@/types/catalog";

interface ProductCardProps {
  readonly product: ProductSummary;
}

const CONFIRM_MS = 1100;

function toFirstImageUrl(images: readonly string[]): string {
  return resolveAssetUrl(images[0]) ?? "/placeholder-product.png";
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [confirming, setConfirming] = useState(false);
  const pricing = derivePricing(product);
  const imageUrl = toFirstImageUrl(product.images);

  const handleAddToCart = async () => {
    try {
      await addItem(product, 1);
      setConfirming(true);
      setTimeout(() => setConfirming(false), CONFIRM_MS);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <motion.article
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group relative flex flex-col"
    >
      <Link
        href={`/produto/${product.slug}`}
        className="relative block overflow-hidden bg-[var(--mist)]/40 ring-1 ring-[var(--mist)] transition-colors hover:ring-[var(--ink)]/20"
        style={{ aspectRatio: "4 / 5" }}
      >
        <motion.img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.05 },
          }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-product.png";
          }}
        />
        {pricing.hasDiscount && (
          <div className="absolute left-0 top-6 z-10 flex items-center">
            <span
              className="origin-left -rotate-90 translate-x-5 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-[var(--ink)]"
              style={{ writingMode: "horizontal-tb" }}
            >
              − {pricing.discountPercentage}% off
            </span>
          </div>
        )}

        <motion.div
          variants={{
            rest: { opacity: 0, y: 16 },
            hover: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--paper)] text-[var(--ink)] ring-1 ring-[var(--mist)]"
          aria-hidden
        >
          <ArrowUpRight className="h-4 w-4" />
        </motion.div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0 space-y-1">
          <Link href={`/produto/${product.slug}`} className="block">
            <h3 className="font-display text-[1.1rem] leading-[1.2] tracking-[-0.01em] text-[var(--ink)] line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)] line-clamp-2">
              {product.shortDescription}
            </p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] transition-transform hover:scale-105 active:scale-95"
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {confirming ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 30 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <span className="font-mono tabular text-[1.05rem] text-[var(--ink)]">
          {formatBRL(pricing.price)}
        </span>
        {pricing.hasDiscount && pricing.compareAtPrice !== null && (
          <span className="font-mono tabular text-[0.8rem] text-[var(--muted)] line-through">
            {formatBRL(pricing.compareAtPrice)}
          </span>
        )}
      </div>
    </motion.article>
  );
}
