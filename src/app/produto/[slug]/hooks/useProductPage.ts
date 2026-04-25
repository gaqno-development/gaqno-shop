import { useState } from "react";
import { useParams } from "next/navigation";
import { derivePricing } from "@/lib/pricing";
import type { Product } from "@/types/catalog";
import { useTenant } from "@/contexts/tenant-context";
import { useBakeryDecorations } from "@/hooks/useBakeryDecorations";
import { useAddToCart } from "./useAddToCart";
import { useBakeryProductOptions } from "./useBakeryProductOptions";
import { useProductLoader } from "./useProductLoader";
import { useQuantity } from "./useQuantity";

function computeStockInfo(product: Product, quantity: number) {
  const isOutOfStock =
    product.trackInventory &&
    product.quantity <= 0 &&
    !product.allowBackorders;
  const maxQuantity = product.trackInventory ? product.quantity : undefined;
  const isLowStock =
    product.trackInventory && product.quantity > 0 && product.quantity <= 5;
  return {
    isOutOfStock,
    maxQuantity,
    isLowStock,
    canIncrement:
      !isOutOfStock &&
      (maxQuantity === undefined || quantity < maxQuantity),
  };
}

export function useProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const { product, relatedProducts, isLoading } = useProductLoader(slug);
  const { featureFlags } = useTenant();
  const isBakery = Boolean(featureFlags?.featureBakery);
  const { data: allDecorations } = useBakeryDecorations();

  const enabledTypeIds = product?.enabledCustomizationTypeIds;
  const decorations = enabledTypeIds?.length
    ? allDecorations.filter((d) => d.customizationTypeId && enabledTypeIds.includes(d.customizationTypeId))
    : allDecorations;

  const quantityControls = useQuantity(
    product?.trackInventory ? product.quantity : undefined,
  );

  const bakeryOptions = useBakeryProductOptions({
    allowsReferenceImage: Boolean(product?.allowsReferenceImage),
    availableDecorations: decorations,
  });

  const { isAddingToCart, handleAddToCart } = useAddToCart(
    product,
    quantityControls.quantity,
    isBakery ? bakeryOptions.buildMeta : undefined,
  );

  const pricing = product ? derivePricing(product) : null;
  const stock = product
    ? computeStockInfo(product, quantityControls.quantity)
    : null;

  return {
    product,
    relatedProducts,
    isLoading,
    selectedImage,
    setSelectedImage,
    pricing,
    stock,
    quantityControls,
    isAddingToCart,
    handleAddToCart,
    isBakery,
    bakeryOptions,
    decorations,
  };
}
