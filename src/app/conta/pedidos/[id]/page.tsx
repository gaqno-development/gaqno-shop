"use client";

import {
  AccountOrderHeader,
  AccountOrderItemsList,
  AccountOrderLoadingScreen,
  AccountOrderNotFound,
  AccountOrderStatusTimeline,
  AccountOrderSummaryCard,
} from "./components";
import { useAccountOrderDetail } from "./hooks/useAccountOrderDetail";

export default function OrderDetailPage() {
  const { order, isPageLoading } = useAccountOrderDetail();

  if (isPageLoading) {
    return <AccountOrderLoadingScreen />;
  }

  if (!order) {
    return <AccountOrderNotFound />;
  }

  return (
    <div className="space-y-6">
      <AccountOrderHeader order={order} />
      <AccountOrderStatusTimeline history={order.statusHistory} />
      <AccountOrderItemsList items={order.items} />
      <AccountOrderSummaryCard order={order} />
    </div>
  );
}
