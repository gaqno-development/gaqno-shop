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
    <div className="space-y-6">
      <div>
        {product.category && (
          <Link
            href={`/produtos?category=${product.category.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            {product.category.name}
          </Link>
        )}
        <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
        {product.sku && (
          <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
        )}
      </div>

      <ProductPrice pricing={pricing} />

      {product.shortDescription && (
        <p className="text-gray-600">{product.shortDescription}</p>
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
