import { useCallback, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import type { PaymentMethod } from "../types";
import { useCheckoutForm } from "./useCheckoutForm";
import { useCheckoutSubmit } from "./useCheckoutSubmit";
import { useCoupon } from "./useCoupon";
import { useRedirectWhenCartEmpty } from "./useRedirectWhenCartEmpty";
import { useShippingOptions } from "./useShippingOptions";

export function useCheckoutPage() {
  const { cart, clearCart } = useCart();
  const form = useCheckoutForm();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  useRedirectWhenCartEmpty(cart);

  const shipping = useShippingOptions(cart, form.shippingAddress.zip);
  const coupon = useCoupon(cart?.subtotal ?? 0);
  const { isSubmitting, submit } = useCheckoutSubmit();

  const shippingCost = shipping.selected?.price ?? 0;
  const total = (cart?.subtotal ?? 0) + shippingCost - coupon.discount;

  const handleSubmit = useCallback(async () => {
    if (!cart) return;
    await submit({
      customer: form.customer,
      shippingAddress: form.shippingAddress,
      billingAddress: form.sameAsShipping
        ? form.shippingAddress
        : form.billingAddress,
      paymentMethod,
      couponCode: coupon.code,
      notes: form.notes,
      onSuccess: (number) => {
        setOrderNumber(number);
        setOrderComplete(true);
        clearCart();
      },
    });
  }, [cart, coupon.code, form, paymentMethod, submit, clearCart]);

  return {
    cart,
    form,
    paymentMethod,
    setPaymentMethod,
    shipping,
    coupon,
    isSubmitting,
    orderComplete,
    orderNumber,
    shippingCost,
    total,
    handleSubmit,
  };
}
