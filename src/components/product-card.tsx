"use client";

import { useTenant } from "@/contexts/tenant-context";
import { useCart } from "@/contexts/cart-context";
import { R2_PUBLIC_URL } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  images: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { tenant } = useTenant();
  const { addItem } = useCart();

  const price = parseFloat(product.price);
  const compareAtPrice = product.compareAtPrice 
    ? parseFloat(product.compareAtPrice) 
    : null;
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  const imageUrl = product.images?.[0] 
    ? `${R2_PUBLIC_URL}/${product.images[0]}`
    : "/placeholder-product.png";

  const handleAddToCart = async () => {
    try {
      await addItem(product, 1);
      // Could show toast notification here
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Product Image */}
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
          {hasDiscount && (
            <span 
              className="absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: tenant?.primaryColor || "#e11d48" }}
            >
              {Math.round((1 - price / compareAtPrice) * 100)}% OFF
            </span>
          )}
        </div>
      </a>

      {/* Product Info */}
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

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span 
            className="text-lg font-bold"
            style={{ color: tenant?.primaryColor || "#111827" }}
          >
            R$ {price.toFixed(2).replace(".", ",")}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              R$ {compareAtPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
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
