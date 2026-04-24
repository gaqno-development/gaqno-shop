import { useCallback, useState } from "react";
import { createCheckout, getPaymentStatus, processPayment } from "@/lib/api";
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
  readonly onSuccess: (orderNumber: string) => void;
  readonly onPending: (orderNumber: string) => void;
  readonly onFailure: (message: string) => void;
}

function mapAddress(address: CheckoutAddress) {
  return {
    name: `${address.firstName} ${address.lastName}`.trim(),
    cep: address.zip,
    street: address.address1,
    number: address.address2 || "S/N",
    neighborhood: address.province,
    city: address.city,
    state: address.province,
    complement: address.phone,
  };
}

export function useCheckoutSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function waitForPaymentApproval(orderNumber: string): Promise<boolean> {
    const attempts = 6;
    const delayMs = 1500;
    for (let i = 0; i < attempts; i += 1) {
      const statusPayload = await getPaymentStatus(orderNumber) as {
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

  const submit = useCallback(async (input: SubmitInput) => {
    setIsSubmitting(true);
    try {
      const result = await createCheckout(input.sessionId, {
        sessionId: input.sessionId,
        items: input.items.map((item) => ({
          productId: item.productId,
          variationId: item.variationId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          imageUrl: item.imageUrl,
        })),
        shippingAddress: mapAddress(input.shippingAddress),
        billingAddress: mapAddress(input.billingAddress),
        customerNotes: input.notes || undefined,
      });
      if (result?.orderNumber) {
        input.onPending(result.orderNumber);
        await processPayment(result.orderNumber, {
          paymentMethod: input.paymentMethod,
          payerEmail: input.customer.email,
        });
        const approved = await waitForPaymentApproval(result.orderNumber);
        if (!approved) {
          input.onFailure("Pagamento ainda não confirmado.");
          return;
        }
        input.onSuccess(result.orderNumber);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      input.onFailure("Erro ao finalizar pagamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, submit };
}
