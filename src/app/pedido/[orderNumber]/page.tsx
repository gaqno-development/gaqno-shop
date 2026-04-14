"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, Truck, CreditCard, CheckCircle, Clock } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { getOrder } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: number;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  createdAt: string;
  notes: string | null;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  items: {
    productName: string;
    productImage: string | null;
    quantity: number;
    unitPrice: number;
    total: number;
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
  pending: "text-yellow-600",
  confirmed: "text-blue-600",
  processing: "text-purple-600",
  shipped: "text-indigo-600",
  delivered: "text-green-600",
  cancelled: "text-red-600",
  refunded: "text-gray-600",
};

function OrderDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { tenant } = useTenant();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderNumber = params.orderNumber as string;
  const email = searchParams.get("email") || "";

  useEffect(() => {
    async function loadOrder() {
      if (!email) {
        setError("Email não fornecido");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getOrder(orderNumber, email);
        setOrder(data);
      } catch (err) {
        setError("Pedido não encontrado");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderNumber, email]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
        <p className="text-gray-600 mb-8">{error || "O pedido que você está procurando não existe."}</p>
        <Link
          href="/pedidos"
          className="px-6 py-3 text-white rounded-lg"
          style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
        >
          Voltar aos pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href={`/pedidos?email=${encodeURIComponent(email)}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar aos pedidos
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pedido #{order.orderNumber}</h1>
          <p className="text-gray-500">Realizado em {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`px-4 py-2 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      {/* Status Timeline */}
      <div className="bg-white p-6 rounded-lg border mb-8">
        <div className="flex items-center justify-between">
          {["pending", "confirmed", "processing", "shipped", "delivered"].map((status, index, array) => {
            const isActive = ["confirmed", "processing", "shipped", "delivered"].includes(order.status) ||
              (order.status === "pending" && status === "pending");
            const isCurrent = order.status === status;
            
            return (
              <div key={status} className="flex items-center">
                <div className={`flex flex-col items-center ${isActive ? "text-blue-600" : "text-gray-300"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCurrent ? "border-blue-600 bg-blue-50" : 
                    isActive ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {index === 0 && <CheckCircle className="h-5 w-5" />}
                    {index === 1 && <CreditCard className="h-5 w-5" />}
                    {index === 2 && <Package className="h-5 w-5" />}
                    {index === 3 && <Truck className="h-5 w-5" />}
                    {index === 4 && <CheckCircle className="h-5 w-5" />}
                  </div>
                  <span className="text-xs mt-2 hidden sm:block">
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                {index < array.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${isActive ? "bg-blue-600" : "bg-gray-300"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 py-4 border-b last:border-0">
                  <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-full w-full p-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                    <p className="font-semibold mt-1">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Endereço de Entrega
            </h2>
            <div className="text-gray-700">
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.province} {" "}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h2 className="text-lg font-semibold mb-2">Observações</h2>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Resumo</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>{order.shippingAmount === 0 ? "Grátis" : formatCurrency(order.shippingAmount)}</span>
              </div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Impostos</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-2">Informações do Cliente</h3>
              <div className="text-sm text-gray-600">
                <p>{order.customer.firstName} {order.customer.lastName}</p>
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    }>
      <OrderDetailContent />
    </Suspense>
  );
}
