import { useCallback, useState } from "react";
import {
  INITIAL_ADDRESS,
  INITIAL_CUSTOMER,
  type CheckoutAddress,
  type CheckoutCustomer,
} from "../types";

export function useCheckoutForm() {
  const [customer, setCustomer] = useState<CheckoutCustomer>(INITIAL_CUSTOMER);
  const [shippingAddress, setShippingAddress] =
    useState<CheckoutAddress>(INITIAL_ADDRESS);
  const [billingAddress, setBillingAddress] =
    useState<CheckoutAddress>(INITIAL_ADDRESS);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [notes, setNotes] = useState("");

  const patchCustomer = useCallback(
    (partial: Partial<CheckoutCustomer>) =>
      setCustomer((prev) => ({ ...prev, ...partial })),
    [],
  );

  const patchShippingAddress = useCallback(
    (partial: Partial<CheckoutAddress>) =>
      setShippingAddress((prev) => ({ ...prev, ...partial })),
    [],
  );

  const patchBillingAddress = useCallback(
    (partial: Partial<CheckoutAddress>) =>
      setBillingAddress((prev) => ({ ...prev, ...partial })),
    [],
  );

  return {
    customer,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    notes,
    patchCustomer,
    patchShippingAddress,
    patchBillingAddress,
    setSameAsShipping,
    setNotes,
  };
}
