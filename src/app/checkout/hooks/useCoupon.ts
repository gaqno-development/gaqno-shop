import { useCallback, useState } from "react";
import { validateCoupon } from "@/lib/api";

export function useCoupon(subtotal: number) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const apply = useCallback(async () => {
    if (!code) return;
    try {
      const result = await validateCoupon(code, subtotal);
      if (result?.valid) {
        setDiscount(result.discount ?? 0);
      }
    } catch (error) {
      console.error("Invalid coupon:", error);
    }
  }, [code, subtotal]);

  return { code, discount, setCode, apply };
}
