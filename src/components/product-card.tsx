"use client";

import { useTenant } from "@/contexts/tenant-context";
import { useCart } from "@/contexts/cart-context";
import { R2_PUBLIC_URL } from "@/lib/api";
import { formatBRL } from "@/lib/formatters";
import { derivePricing } from "@/lib/pricing";
import type { ProductSummary } from "@/types/catalog";

interface ProductCardProps {
  readonly product: ProductSummary;
}

function toFirstImageUrl(images: readonly string[]): string {
  return images[0] ? `${R2_PUBLIC_URL}/${images[0]}` : "/placeholder-product.png";
}

export default function ProductCard({ product }: ProductCardProps) {
  const { tenant } = useTenant();
  const { addItem } = useCart();
  const pricing = derivePricing(product);
  const imageUrl = toFirstImageUrl(product.images);

  const handleAddToCart = async () => {
    try {
      await addItem(product, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <a href={`/produto/${product.slug}`} className="block">
        <div className="aspect-square bg-gray-100 relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.png";
            }}
          />
          {pricing.hasDiscount && (
            <span
              className="absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: tenant?.primaryColor || "#e11d48" }}
            >
              {pricing.discountPercentage}% OFF
            </span>
          )}
        </div>
      </a>

      <div className="p-4">
        <a href={`/produto/${product.slug}`} className="block">
          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h4>
          {product.shortDescription && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {product.shortDescription}
            </p>
          )}
        </a>

        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-lg font-bold"
            style={{ color: tenant?.primaryColor || "#111827" }}
          >
            {formatBRL(pricing.price)}
          </span>
          {pricing.hasDiscount && pricing.compareAtPrice !== null && (
            <span className="text-sm text-gray-400 line-through">
              {formatBRL(pricing.compareAtPrice)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full py-2 px-4 rounded-md text-white font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
