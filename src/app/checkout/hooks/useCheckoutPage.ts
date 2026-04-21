import { useCallback, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useTenant } from "@/contexts/tenant-context";
import type { PaymentMethod } from "../types";
import { useCheckoutForm } from "./useCheckoutForm";
import { useCheckoutSubmit } from "./useCheckoutSubmit";
import { useCoupon } from "./useCoupon";
import { useDeliverySchedule } from "./useDeliverySchedule";
import { useRedirectWhenCartEmpty } from "./useRedirectWhenCartEmpty";
import { useShippingOptions } from "./useShippingOptions";

export function useCheckoutPage() {
  const { cart, clearCart } = useCart();
  const { featureFlags } = useTenant();
  const isBakery = Boolean(featureFlags?.featureBakery);
  const form = useCheckoutForm();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  useRedirectWhenCartEmpty(cart);

  const shipping = useShippingOptions(cart, form.shippingAddress.zip);
  const coupon = useCoupon(cart?.subtotal ?? 0);
  const delivery = useDeliverySchedule(cart?.items ?? []);
  const { isSubmitting, submit } = useCheckoutSubmit();

  const shippingCost = shipping.selected?.price ?? 0;
  const total = (cart?.subtotal ?? 0) + shippingCost - coupon.discount;

  const handleSubmit = useCallback(async () => {
    if (!cart) return;
    if (isBakery && delivery.minLeadDays > 0 && !delivery.isValid) return;
    const bakeryNotes =
      isBakery && delivery.deliveryDate
        ? [
            form.notes,
            `Entrega: ${delivery.deliveryDate}${
              delivery.deliveryTime ? ` ${delivery.deliveryTime}` : ""
            }${delivery.isPickup ? " (retirada)" : ""}`,
          ]
            .filter(Boolean)
            .join(" | ")
        : form.notes;
    await submit({
      customer: form.customer,
      shippingAddress: form.shippingAddress,
      billingAddress: form.sameAsShipping
        ? form.shippingAddress
        : form.billingAddress,
      paymentMethod,
      couponCode: coupon.code,
      notes: bakeryNotes,
      onSuccess: (number) => {
        setOrderNumber(number);
        setOrderComplete(true);
        clearCart();
      },
    });
  }, [cart, coupon.code, form, paymentMethod, submit, clearCart, isBakery, delivery]);

  return {
    cart,
    form,
    paymentMethod,
    setPaymentMethod,
    shipping,
    coupon,
    delivery,
    isBakery,
    isSubmitting,
    orderComplete,
    orderNumber,
    shippingCost,
    total,
    handleSubmit,
  };
}
