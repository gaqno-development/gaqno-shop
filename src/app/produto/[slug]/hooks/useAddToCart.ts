import { useCallback, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types/catalog";
import type { OrderItemBakeryMeta } from "@/types/bakery";

export function useAddToCart(
  product: Product | null,
  quantity: number,
  buildBakeryMeta?: () => OrderItemBakeryMeta | undefined,
) {
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      const bakeryMeta = buildBakeryMeta ? buildBakeryMeta() : undefined;
      await addItem(product, quantity, undefined, bakeryMeta);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [addItem, product, quantity, buildBakeryMeta]);

  return { isAddingToCart, handleAddToCart };
}
