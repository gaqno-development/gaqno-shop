"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  ContactSection,
  NotesSection,
  OrderCompleteScreen,
  OrderSummary,
  PaymentSection,
  ShippingSection,
} from "./components";
import { useCheckoutPage } from "./hooks/useCheckoutPage";

function CheckoutContent() {
  const page = useCheckoutPage();

  if (page.orderComplete) {
    return (
      <OrderCompleteScreen
        orderNumber={page.orderNumber}
        email={page.form.customer.email}
      />
    );
  }

  if (!page.cart) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/carrinho"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar ao carrinho
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ContactSection
            customer={page.form.customer}
            onChange={page.form.patchCustomer}
          />
          <ShippingSection
            address={page.form.shippingAddress}
            onAddressChange={page.form.patchShippingAddress}
            options={page.shipping.options}
            selectedOption={page.shipping.selected}
            onSelectOption={page.shipping.setSelected}
          />
          <PaymentSection
            selected={page.paymentMethod}
            onSelect={page.setPaymentMethod}
          />
          <NotesSection value={page.form.notes} onChange={page.form.setNotes} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            cart={page.cart}
            shippingCost={page.shippingCost}
            discount={page.coupon.discount}
            total={page.total}
            couponCode={page.coupon.code}
            onCouponChange={page.coupon.setCode}
            onApplyCoupon={page.coupon.apply}
            isSubmitting={page.isSubmitting}
            canSubmit={!!page.shipping.selected}
            onSubmit={page.handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
