import { useCallback, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types/catalog";

export function useAddToCart(product: Product | null, quantity: number) {
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await addItem(product, quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [addItem, product, quantity]);

  return { isAddingToCart, handleAddToCart };
}
