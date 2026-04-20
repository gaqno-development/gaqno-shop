import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CartSummary } from "@/contexts/cart-context";

export function useRedirectWhenCartEmpty(cart: CartSummary | null) {
  const router = useRouter();
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push("/carrinho");
    }
  }, [cart, router]);
}
