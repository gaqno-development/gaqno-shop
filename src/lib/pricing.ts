import type { ProductSummary } from "@/types/catalog";

export interface ProductPricing {
  readonly price: number;
  readonly compareAtPrice: number | null;
  readonly hasDiscount: boolean;
  readonly discountPercentage: number;
}

export function derivePricing(product: ProductSummary): ProductPricing {
  const price = parseFloat(product.price);
  const compareAtPrice = product.compareAtPrice
    ? parseFloat(product.compareAtPrice)
    : null;
  const hasDiscount = compareAtPrice !== null && compareAtPrice > price;
  const discountPercentage =
    hasDiscount && compareAtPrice !== null
      ? Math.round((1 - price / compareAtPrice) * 100)
      : 0;
  return { price, compareAtPrice, hasDiscount, discountPercentage };
}
