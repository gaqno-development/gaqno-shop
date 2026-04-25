import { useCallback, useEffect, useState } from "react";
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

export interface PixCheckoutPayload {
  readonly orderNumber: string;
  readonly qrCode?: string;
  readonly qrCodeBase64?: string;
  readonly expiresAt?: string;
}

export function useCheckoutPage() {
  const { cart, clearCart, sessionId } = useCart();
  const { featureFlags, isLoading: tenantLoading } = useTenant();
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
  const [pixCheckout, setPixCheckout] = useState<PixCheckoutPayload | null>(null);

  useRedirectWhenCartEmpty(cart);

  const shipping = useShippingOptions(cart, form.shippingAddress.zip);
  const coupon = useCoupon(cart?.subtotal ?? 0);
  const delivery = useDeliverySchedule(cart?.items ?? []);
  const { isSubmitting, submit } = useCheckoutSubmit();

  const shippingCost = shipping.selected?.price ?? 0;
  const total = (cart?.subtotal ?? 0) + shippingCost - coupon.discount;

  useEffect(() => {
    if (tenantLoading) return;
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
  }, [paymentMethod, tenantLoading]);

  const handleSubmit = useCallback(async () => {
    if (!cart) return;
    if (!shipping.selected?.id) return;
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
    setPixCheckout(null);
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
      shippingMethodId: shipping.selected.id,
      deliveryDate: isBakery ? delivery.deliveryDate : undefined,
      deliveryTime: isBakery ? delivery.deliveryTime : undefined,
      deliveryIsPickup: isBakery ? delivery.isPickup : undefined,
      onPending: (number) => {
        setOrderNumber(number);
        setPaymentState("initiating_payment");
        setPaymentMessage("Iniciando pagamento...");
        setPaymentState("awaiting_confirmation");
        setPaymentMessage("Aguardando confirmação de pagamento...");
      },
      onPixData: (payload) => {
        setPixCheckout(payload);
        setPaymentMessage("Escaneie o QR Code para pagar com PIX.");
      },
      onSuccess: async (number) => {
        setOrderNumber(number);
        setPixCheckout(null);
        setPaymentState("approved");
        setPaymentMessage("Pagamento confirmado.");
        setOrderComplete(true);
        await clearCart();
      },
      onFailure: (message) => {
        setPaymentState("failed");
        setPaymentMessage(message);
      },
    });
  }, [
    cart,
    coupon.code,
    form,
    paymentMethod,
    submit,
    clearCart,
    isBakery,
    delivery,
    sessionId,
    shipping.selected,
  ]);

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
    pixCheckout,
    handleSubmit,
  };
}
