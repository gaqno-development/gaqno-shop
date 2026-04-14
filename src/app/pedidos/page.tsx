"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Package, ChevronRight } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { getOrders } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

function OrdersContent() {
  const { tenant } = useTenant();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const data = await getOrders(email);
      setOrders(data || []);
      router.push(`/pedidos?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 
        className="text-3xl font-bold mb-8"
        style={{ color: tenant?.primaryColor || "#111827" }}
      >
        Meus Pedidos
      </h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email para ver seus pedidos"
              className="w-full px-4 py-3 pl-12 border rounded-lg"
              required
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {/* Results */}
      {hasSearched && (
        <>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
              <p className="text-gray-600 mb-6">
                Não encontramos pedidos associados a este email.
              </p>
              <Link
                href="/produtos"
                className="inline-block px-6 py-3 text-white rounded-lg"
                style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
              >
                Começar a comprar
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/pedido/${order.orderNumber}?email=${encodeURIComponent(email)}`}
                  className="block bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Pedido #{order.orderNumber}</p>
                      <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {order.items.map(item => item.productName).join(", ")}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
                      <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
