import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export interface MyOrderRow {
  readonly id: string;
  readonly orderNumber: string;
  readonly status: string;
  readonly paymentStatus: string;
  readonly total: string;
  readonly createdAt: string;
  readonly items: number;
}

interface Pagination {
  readonly page: number;
  readonly totalPages: number;
  readonly total: number;
}

interface MyOrdersResponse {
  readonly items?: readonly MyOrderRow[];
  readonly page?: number;
  readonly totalPages?: number;
  readonly total?: number;
}

const INITIAL_PAGINATION: Pagination = { page: 1, totalPages: 1, total: 0 };

export function useMyOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<readonly MyOrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>(INITIAL_PAGINATION);

  const setPage = useCallback((page: number) => {
    setPagination((current) => ({ ...current, page }));
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/conta/pedidos");
      return;
    }
    if (status !== "authenticated" || !session?.accessToken) return;

    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const data = (await fetchApi(
          `/orders/my-orders?page=${pagination.page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${session!.accessToken as string}`,
            },
          },
        )) as MyOrdersResponse;
        if (cancelled) return;
        setOrders(data.items ?? []);
        setError(null);
        setPagination({
          page: data.page ?? 1,
          totalPages: data.totalPages ?? 1,
          total: data.total ?? 0,
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (!cancelled) {
          setError("Não foi possível carregar seus pedidos.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [status, session, pagination.page, router]);

  return {
    orders,
    isLoading: isLoading || status === "loading",
    error,
    pagination,
    setPage,
  } as const;
}
