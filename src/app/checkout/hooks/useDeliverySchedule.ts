"use client";

import { useCallback, useMemo, useState } from "react";
import type { CartItem } from "@/contexts/cart-context";

function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added += 1;
  }
  return result;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function computeMinLeadDays(items: readonly CartItem[]): number {
  return items.reduce((max, item) => {
    const lead = (item as CartItem & { leadDays?: number })?.leadDays ?? 0;
    return lead > max ? lead : max;
  }, 0);
}

export function useDeliverySchedule(cartItems: readonly CartItem[]) {
  const minLeadDays = useMemo(() => computeMinLeadDays(cartItems), [cartItems]);
  const minDate = useMemo(
    () => toIsoDate(addBusinessDays(new Date(), minLeadDays)),
    [minLeadDays],
  );

  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [isPickup, setIsPickup] = useState<boolean>(false);

  const error = useMemo<string | null>(() => {
    if (!deliveryDate) return null;
    if (deliveryDate < minDate) {
      return `A data de entrega deve ser a partir de ${minDate}.`;
    }
    return null;
  }, [deliveryDate, minDate]);

  const isValid = Boolean(deliveryDate) && error === null;

  const reset = useCallback(() => {
    setDeliveryDate("");
    setDeliveryTime("");
    setIsPickup(false);
  }, []);

  return {
    deliveryDate,
    deliveryTime,
    isPickup,
    minDate,
    minLeadDays,
    error,
    isValid,
    setDeliveryDate,
    setDeliveryTime,
    setIsPickup,
    reset,
  };
}
