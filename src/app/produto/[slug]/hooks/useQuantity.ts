import { useCallback, useState } from "react";
import {
  canIncrementQuantity,
  clampQuantityDecrement,
  clampQuantityIncrement,
} from "./quantity-utils";

export function useQuantity(max?: number) {
  const [quantity, setQuantity] = useState(1);

  const decrement = useCallback(() => {
    setQuantity((current) => clampQuantityDecrement(current));
  }, []);

  const increment = useCallback(() => {
    setQuantity((current) => clampQuantityIncrement(current, max));
  }, [max]);

  const canIncrement = canIncrementQuantity(quantity, max);

  return { quantity, decrement, increment, canIncrement };
}
