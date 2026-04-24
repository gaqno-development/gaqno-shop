import { useEffect, useState } from "react";
import { calculateShipping } from "@/lib/api";
import type { CartSummary } from "@/contexts/cart-context";
import { CHECKOUT_ZIP_LENGTH } from "../constants";
import type { ShippingOption } from "../types";

export function useShippingOptions(cart: CartSummary | null, zip: string) {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selected, setSelected] = useState<ShippingOption | null>(null);

  useEffect(() => {
    if (zip.length !== CHECKOUT_ZIP_LENGTH || !cart) return;
    let cancelled = false;

    async function load() {
      try {
        const items = cart!.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));
        const fetched = (await calculateShipping(
          zip,
          items,
          cart!.subtotal,
        )) as ShippingOption[] | null;
        if (cancelled) return;
        const safe = fetched ?? [];
        setOptions(safe);
        setSelected(safe[0] ?? null);
      } catch (error) {
        console.error("Failed to calculate shipping:", error);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [zip, cart]);

  return { options, selected, setSelected };
}
