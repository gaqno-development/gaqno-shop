import { useEffect, useState } from "react";
import { getOrder } from "@/lib/api";
import type { OrderDetail } from "@/types/order";

export function useOrderDetail(orderNumber: string, email: string) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!email) {
        setError("Email não fornecido");
        setIsLoading(false);
        return;
      }
      try {
        const data = (await getOrder(orderNumber, email)) as OrderDetail;
        if (!cancelled) setOrder(data);
      } catch {
        if (!cancelled) setError("Pedido não encontrado");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [orderNumber, email]);

  return { order, isLoading, error };
}
