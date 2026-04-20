export interface OrderAddress {
  readonly firstName: string;
  readonly lastName: string;
  readonly address1: string;
  readonly address2: string | null;
  readonly city: string;
  readonly province: string;
  readonly zip: string;
  readonly country: string;
}

export interface OrderCustomer {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
}

export interface OrderItem {
  readonly productName: string;
  readonly productImage: string | null;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly total: number;
}

export interface OrderDetail {
  readonly id: string;
  readonly orderNumber: string;
  readonly status: string;
  readonly paymentStatus: string;
  readonly fulfillmentStatus: string;
  readonly total: number;
  readonly subtotal: number;
  readonly shippingAmount: number;
  readonly taxAmount: number;
  readonly discountAmount: number;
  readonly createdAt: string;
  readonly notes: string | null;
  readonly customer: OrderCustomer;
  readonly shippingAddress: OrderAddress;
  readonly items: readonly OrderItem[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-600",
  confirmed: "text-blue-600",
  processing: "text-purple-600",
  shipped: "text-indigo-600",
  delivered: "text-green-600",
  cancelled: "text-red-600",
  refunded: "text-gray-600",
};

export const TIMELINE_STATUSES: readonly OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export const TIMELINE_ACTIVE_STATUSES: readonly string[] = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];
