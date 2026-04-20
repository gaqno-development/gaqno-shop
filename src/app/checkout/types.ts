import type { CheckoutData } from "@/lib/api";

export type PaymentMethod = "credit_card" | "pix" | "boleto";

export type CheckoutAddress = CheckoutData["shippingAddress"];

export type CheckoutCustomer = CheckoutData["customer"];

export interface ShippingOption {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly deliveryTime: number;
}

export const INITIAL_CUSTOMER: CheckoutCustomer = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  document: "",
};

export const INITIAL_ADDRESS: CheckoutAddress = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  zip: "",
  country: "BR",
  phone: "",
};
