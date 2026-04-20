export interface AccountOrderItem {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly price: string;
  readonly imageUrl: string | null;
}

export interface AccountOrderStatusHistoryEntry {
  readonly status: string;
  readonly notes: string | null;
  readonly createdAt: string;
}

export interface AccountOrderShippingAddress {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly address1?: string;
  readonly address2?: string | null;
  readonly city?: string;
  readonly province?: string;
  readonly zip?: string;
  readonly country?: string;
}

export interface AccountOrderDetail {
  readonly id: string;
  readonly orderNumber: string;
  readonly status: string;
  readonly paymentStatus: string;
  readonly paymentMethod: string;
  readonly subtotal: string;
  readonly shippingAmount: string;
  readonly discountAmount: string;
  readonly total: string;
  readonly createdAt: string;
  readonly shippedAt: string | null;
  readonly deliveredAt: string | null;
  readonly shippingAddress: AccountOrderShippingAddress | null;
  readonly items: readonly AccountOrderItem[];
  readonly statusHistory: readonly AccountOrderStatusHistoryEntry[];
}
