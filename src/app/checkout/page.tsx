"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import {
  ContactSection,
  DeliveryScheduleSection,
  NotesSection,
  OrderCompleteScreen,
  OrderSummary,
  PaymentSection,
  ShippingSection,
} from "./components";
import { useCheckoutPage } from "./hooks/useCheckoutPage";

const EASE = [0.19, 1, 0.22, 1] as const;

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
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 md:py-20">
      <div className="mb-10 flex items-center justify-between">
        <Link
          href="/carrinho"
          className="link-underline inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar ao carrinho
        </Link>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--muted)]">
          Checkout · seguro
        </span>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-16 border-b border-[var(--mist)] pb-10"
      >
        <span className="eyebrow">Finalizar compra</span>
        <h1
          className="mt-4 font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] tracking-[-0.035em] text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          Quase <em className="italic">lá</em>.
        </h1>
      </motion.header>

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
        <div className="space-y-16">
          {page.paymentState !== "idle" && !page.orderComplete ? (
            <div className="rounded-md border border-[var(--mist)] px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
              {page.paymentMessage || "Processando pagamento"}
            </div>
          ) : null}
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
          {page.isBakery ? (
            <DeliveryScheduleSection
              deliveryDate={page.delivery.deliveryDate}
              deliveryTime={page.delivery.deliveryTime}
              isPickup={page.delivery.isPickup}
              minDate={page.delivery.minDate}
              minLeadDays={page.delivery.minLeadDays}
              error={page.delivery.error}
              onChangeDate={page.delivery.setDeliveryDate}
              onChangeTime={page.delivery.setDeliveryTime}
              onChangeIsPickup={page.delivery.setIsPickup}
            />
          ) : null}
          <PaymentSection
            selected={page.paymentMethod}
            onSelect={page.setPaymentMethod}
            availableMethods={page.availablePaymentMethods}
          />
          <NotesSection value={page.form.notes} onChange={page.form.setNotes} />
        </div>

        <OrderSummary
          cart={page.cart}
          shippingCost={page.shippingCost}
          discount={page.coupon.discount}
          total={page.total}
          couponCode={page.coupon.code}
          onCouponChange={page.coupon.setCode}
          onApplyCoupon={page.coupon.apply}
          isSubmitting={page.isSubmitting}
          canSubmit={
            !!page.shipping.selected &&
            (!page.isBakery ||
              page.delivery.minLeadDays === 0 ||
              page.delivery.isValid)
          }
          onSubmit={page.handleSubmit}
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-24 text-center font-mono text-[0.72rem] uppercase tracking-[0.26em] text-[var(--muted)]">
          Preparando seu checkout<span className="ml-1">…</span>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
