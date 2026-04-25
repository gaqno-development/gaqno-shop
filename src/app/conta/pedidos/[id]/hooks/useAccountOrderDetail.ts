import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import type { AccountOrderDetail } from "../types";

async function fetchOrder(
  id: string,
  accessToken: string,
): Promise<AccountOrderDetail> {
  return fetchApi(`/orders/my-orders/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }) as Promise<AccountOrderDetail>;
}

export function useAccountOrderDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<AccountOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated" || !session?.accessToken) return;

    let cancelled = false;
    async function load() {
      try {
        const data = await fetchOrder(id, session!.accessToken as string);
        if (!cancelled) setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [status, id, session, router]);

  return { order, isLoading, isPageLoading: status === "loading" || isLoading };
}
