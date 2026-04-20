"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  OrderError,
  OrderHeader,
  OrderItemsList,
  OrderLoadingSkeleton,
  OrderNotes,
  OrderShippingAddress,
  OrderSummaryCard,
  OrderTimeline,
} from "./components";
import { useOrderDetail } from "./hooks/useOrderDetail";

function OrderDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params.orderNumber as string;
  const email = searchParams.get("email") || "";
  const { order, isLoading, error } = useOrderDetail(orderNumber, email);

  if (isLoading) {
    return <OrderLoadingSkeleton />;
  }

  if (error || !order) {
    return (
      <OrderError
        message={error ?? "O pedido que você está procurando não existe."}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <OrderHeader order={order} email={email} />
      <OrderTimeline currentStatus={order.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsList items={order.items} />
          <OrderShippingAddress address={order.shippingAddress} />
          <OrderNotes notes={order.notes} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<OrderLoadingSkeleton />}>
      <OrderDetailContent />
    </Suspense>
  );
}
