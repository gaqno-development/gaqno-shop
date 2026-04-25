import { useCallback, useState } from "react";
import {
  MP_CHECKOUT_RETURN_EMAIL_KEY,
  MP_CHECKOUT_RETURN_ORDER_KEY,
  createCheckout,
  getPaymentStatus,
  processPayment,
} from "@/lib/api";
import type {
  CheckoutAddress,
  CheckoutCustomer,
  PaymentMethod,
} from "../types";
import type { CartItem } from "@/contexts/cart-context";

export interface SubmitInput {
  readonly customer: CheckoutCustomer;
  readonly shippingAddress: CheckoutAddress;
  readonly billingAddress: CheckoutAddress;
  readonly paymentMethod: PaymentMethod;
  readonly couponCode: string;
  readonly notes: string;
  readonly sessionId: string;
  readonly items: CartItem[];
  readonly shippingMethodId: string;
  readonly deliveryDate?: string;
  readonly deliveryTime?: string;
  readonly deliveryIsPickup?: boolean;
  readonly onPending: (orderNumber: string) => void;
  readonly onSuccess: (orderNumber: string) => void | Promise<void>;
  readonly onFailure: (message: string) => void;
  readonly onPixData?: (payload: {
    orderNumber: string;
    qrCode?: string;
    qrCodeBase64?: string;
    expiresAt?: string;
  }) => void;
}

function mapAddress(address: CheckoutAddress) {
  const neighborhood = address.neighborhood.trim() || "—";
  const state = address.province.trim();
  return {
    name: `${address.firstName} ${address.lastName}`.trim(),
    cep: address.zip,
    street: address.address1,
    number: address.address2 || "S/N",
    neighborhood,
    city: address.city,
    state,
    complement: address.phone,
  };
}

function mapCartLine(item: CartItem) {
  const meta = item.bakeryMeta;
  const decorations = meta?.decorations?.map((d) => ({
    decorationId: d.decorationId,
    quantity: d.quantity,
  }));
  return {
    productId: item.productId,
    quantity: item.quantity,
    variationId: item.variationId,
    decorations: decorations && decorations.length > 0 ? decorations : undefined,
    size: meta?.size,
    notes: meta?.notes,
    referenceImageUrl: meta?.referenceImageUrl,
  };
}

type ProcessPaymentResult = {
  initPoint?: string;
  sandboxInitPoint?: string;
  paymentUrl?: string;
  preferenceId?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  expiresAt?: string;
};

async function waitForPaymentApproval(
  orderNumber: string,
  options: { isPix: boolean },
): Promise<boolean> {
  const attempts = options.isPix ? 36 : 8;
  const delayMs = options.isPix ? 2000 : 1500;
  for (let i = 0; i < attempts; i += 1) {
    const statusPayload = (await getPaymentStatus(orderNumber)) as {
      paymentStatus?: string;
    };
    const status = String(statusPayload?.paymentStatus ?? "").toLowerCase();
    if (status === "approved" || status === "authorized") {
      return true;
    }
    if (status === "rejected" || status === "cancelled" || status === "refunded") {
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

export function useCheckoutSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (input: SubmitInput) => {
    setIsSubmitting(true);
    try {
      const trimmedCoupon = input.couponCode.trim();
      const result = (await createCheckout(input.sessionId, {
        sessionId: input.sessionId,
        shippingMethodId: input.shippingMethodId,
        couponCode: trimmedCoupon || undefined,
        deliveryDate: input.deliveryDate,
        deliveryTime: input.deliveryTime,
        deliveryIsPickup: input.deliveryIsPickup,
        items: input.items.map(mapCartLine),
        shippingAddress: mapAddress(input.shippingAddress),
        billingAddress: mapAddress(input.billingAddress),
        customerNotes: input.notes || undefined,
      })) as { orderNumber?: string };

      if (!result?.orderNumber) {
        input.onFailure("Não foi possível criar o pedido.");
        return;
      }

      input.onPending(result.orderNumber);

      const pay = (await processPayment(result.orderNumber, {
        paymentMethod: input.paymentMethod,
        payerEmail: input.customer.email,
      })) as ProcessPaymentResult;

      const redirectUrl =
        pay.initPoint ?? pay.sandboxInitPoint ?? pay.paymentUrl;

      if (input.paymentMethod !== "pix" && redirectUrl) {
        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(
              MP_CHECKOUT_RETURN_ORDER_KEY,
              result.orderNumber,
            );
            window.sessionStorage.setItem(
              MP_CHECKOUT_RETURN_EMAIL_KEY,
              input.customer.email,
            );
          } catch {}
          window.location.assign(redirectUrl);
        }
        return;
      }

      if (input.paymentMethod === "pix" && (pay.qrCode || pay.qrCodeBase64)) {
        input.onPixData?.({
          orderNumber: result.orderNumber,
          qrCode: pay.qrCode,
          qrCodeBase64: pay.qrCodeBase64,
          expiresAt: pay.expiresAt,
        });
        const approved = await waitForPaymentApproval(result.orderNumber, {
          isPix: true,
        });
        if (!approved) {
          input.onFailure("Pagamento PIX ainda não confirmado.");
          return;
        }
        await Promise.resolve(input.onSuccess(result.orderNumber));
        return;
      }

      if (input.paymentMethod === "pix") {
        input.onFailure("Resposta PIX inválida. Tente novamente.");
        return;
      }

      const approved = await waitForPaymentApproval(result.orderNumber, {
        isPix: false,
      });
      if (!approved) {
        input.onFailure("Pagamento ainda não confirmado.");
        return;
      }
      await Promise.resolve(input.onSuccess(result.orderNumber));
    } catch (error) {
      console.error("Checkout failed:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Erro ao finalizar pagamento. Tente novamente.";
      input.onFailure(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, submit };
}
