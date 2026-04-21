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
    <section className="relative min-h-[calc(100vh-var(--header-height,0px))] overflow-hidden bg-[var(--paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-15%] h-[420px] w-[420px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--tenant-primary)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-10">
        <OrderHeader order={order} email={email} />
        <OrderTimeline currentStatus={order.status} />

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div className="space-y-14">
            <OrderItemsList items={order.items} />
            <OrderShippingAddress address={order.shippingAddress} />
            <OrderNotes notes={order.notes} />
          </div>
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </section>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<OrderLoadingSkeleton />}>
      <OrderDetailContent />
    </Suspense>
  );
}
