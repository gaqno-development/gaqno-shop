import { useCallback, useState } from "react";
import { createCheckout } from "@/lib/api";
import { CHECKOUT_SESSION_ID } from "../constants";
import type {
  CheckoutAddress,
  CheckoutCustomer,
  PaymentMethod,
} from "../types";

export interface SubmitInput {
  readonly customer: CheckoutCustomer;
  readonly shippingAddress: CheckoutAddress;
  readonly billingAddress: CheckoutAddress;
  readonly paymentMethod: PaymentMethod;
  readonly couponCode: string;
  readonly notes: string;
  readonly onSuccess: (orderNumber: string) => void;
}

export function useCheckoutSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async (input: SubmitInput) => {
    setIsSubmitting(true);
    try {
      const result = await createCheckout(CHECKOUT_SESSION_ID, {
        customer: input.customer,
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress,
        paymentMethod: input.paymentMethod,
        couponCode: input.couponCode || undefined,
        notes: input.notes || undefined,
      });
      if (result?.orderNumber) {
        input.onSuccess(result.orderNumber);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Erro ao finalizar compra. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, submit };
}
