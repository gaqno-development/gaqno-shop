import Link from "next/link";
import type { Product } from "@/types/catalog";
import type { ProductPricing } from "@/lib/pricing";
import { ProductPrice } from "./ProductPrice";
import { ProductStockStatus } from "./ProductStockStatus";
import { ProductPurchaseControls } from "./ProductPurchaseControls";
import { ProductFeatures } from "./ProductFeatures";

interface Props {
  readonly product: Product;
  readonly pricing: ProductPricing;
  readonly quantity: number;
  readonly onDecrement: () => void;
  readonly onIncrement: () => void;
  readonly canIncrement: boolean;
  readonly isOutOfStock: boolean;
  readonly isLowStock: boolean;
  readonly isAddingToCart: boolean;
  readonly onAddToCart: () => void;
}

export function ProductInfo({
  product,
  pricing,
  quantity,
  onDecrement,
  onIncrement,
  canIncrement,
  isOutOfStock,
  isLowStock,
  isAddingToCart,
  onAddToCart,
}: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        {product.category && (
          <Link
            href={`/produtos?category=${product.category.slug}`}
            className="link-underline font-mono text-[0.68rem] uppercase tracking-[0.26em] text-[var(--muted)] hover:text-[var(--ink)]"
          >
            {product.category.name}
          </Link>
        )}
        <h1
          className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          {product.name}
        </h1>
        {product.sku && (
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            Ref · {product.sku}
          </p>
        )}
      </div>

      <div className="hairline" />

      <ProductPrice pricing={pricing} />

      {product.shortDescription && (
        <p className="max-w-md text-[1rem] leading-relaxed text-[var(--ink)]/75">
          {product.shortDescription}
        </p>
      )}

      <ProductStockStatus
        isOutOfStock={isOutOfStock}
        isLowStock={isLowStock}
        quantity={product.quantity}
      />

      <ProductPurchaseControls
        quantity={quantity}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        canIncrement={canIncrement}
        isOutOfStock={isOutOfStock}
        isAddingToCart={isAddingToCart}
        onAddToCart={onAddToCart}
      />

      <ProductFeatures />
    </div>
  );
}
