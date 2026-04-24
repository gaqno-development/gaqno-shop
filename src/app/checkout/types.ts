export type PaymentMethod = "credit_card" | "pix" | "boleto";

export interface CheckoutAddress {
  readonly firstName: string;
  readonly lastName: string;
  readonly address1: string;
  readonly address2: string;
  readonly city: string;
  readonly province: string;
  readonly zip: string;
  readonly country: string;
  readonly phone: string;
}

export interface CheckoutCustomer {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly document: string;
}

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
