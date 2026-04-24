import { useCallback, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useTenant } from "@/contexts/tenant-context";
import type { PaymentMethod } from "../types";
import { getPaymentMethods } from "@/lib/api";
import { useCheckoutForm } from "./useCheckoutForm";
import { useCheckoutSubmit } from "./useCheckoutSubmit";
import { useCoupon } from "./useCoupon";
import { useDeliverySchedule } from "./useDeliverySchedule";
import { useRedirectWhenCartEmpty } from "./useRedirectWhenCartEmpty";
import { useShippingOptions } from "./useShippingOptions";
import { useEffect } from "react";

export function useCheckoutPage() {
  const { cart, clearCart, sessionId } = useCart();
  const { featureFlags } = useTenant();
  const isBakery = Boolean(featureFlags?.featureBakery);
  const form = useCheckoutForm();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethod[]>([
    "credit_card",
  ]);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentState, setPaymentState] = useState<
    "idle" | "creating_order" | "initiating_payment" | "awaiting_confirmation" | "approved" | "failed"
  >("idle");
  const [paymentMessage, setPaymentMessage] = useState("");

  useRedirectWhenCartEmpty(cart);

  const shipping = useShippingOptions(cart, form.shippingAddress.zip);
  const coupon = useCoupon(cart?.subtotal ?? 0);
  const delivery = useDeliverySchedule(cart?.items ?? []);
  const { isSubmitting, submit } = useCheckoutSubmit();

  const shippingCost = shipping.selected?.price ?? 0;
  const total = (cart?.subtotal ?? 0) + shippingCost - coupon.discount;

  useEffect(() => {
    let active = true;
    getPaymentMethods()
      .then((methods) => {
        if (!active) return;
        const mapped = methods.filter((method): method is PaymentMethod =>
          ["credit_card", "pix", "boleto"].includes(method),
        );
        if (mapped.length === 0) return;
        setAvailablePaymentMethods(mapped);
        if (!mapped.includes(paymentMethod)) {
          setPaymentMethod(mapped[0]);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [paymentMethod]);

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
    setPaymentState("creating_order");
    setPaymentMessage("");
    await submit({
      customer: form.customer,
      shippingAddress: form.shippingAddress,
      billingAddress: form.sameAsShipping
        ? form.shippingAddress
        : form.billingAddress,
      paymentMethod,
      couponCode: coupon.code,
      notes: bakeryNotes,
      sessionId,
      items: cart.items,
      onPending: (number) => {
        setOrderNumber(number);
        setPaymentState("initiating_payment");
        setPaymentMessage("Iniciando pagamento...");
        setPaymentState("awaiting_confirmation");
        setPaymentMessage("Aguardando confirmação de pagamento...");
      },
      onSuccess: (number) => {
        setOrderNumber(number);
        setPaymentState("approved");
        setPaymentMessage("Pagamento confirmado.");
        setOrderComplete(true);
        clearCart();
      },
      onFailure: (message) => {
        setPaymentState("failed");
        setPaymentMessage(message);
      },
    });
  }, [cart, coupon.code, form, paymentMethod, submit, clearCart, isBakery, delivery, sessionId]);

  return {
    cart,
    form,
    paymentMethod,
    setPaymentMethod,
    availablePaymentMethods,
    shipping,
    coupon,
    delivery,
    isBakery,
    isSubmitting,
    orderComplete,
    orderNumber,
    shippingCost,
    total,
    paymentState,
    paymentMessage,
    handleSubmit,
  };
}
