// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4017/v1";
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

// API client
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // Add tenant domain header
  if (typeof window !== "undefined") {
    headers["X-Tenant-Domain"] = window.location.host;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Tenant API
export async function resolveTenant(domain: string) {
  return fetchApi(`/tenants/resolve`, {
    headers: {
      "X-Tenant-Domain": domain,
    },
  });
}

// Categories API
export async function getCategories() {
  return fetchApi(`/categories`);
}

// Product API
export async function getProducts(params?: Record<string, string>) {
  const queryString = params ? `?${new URLSearchParams(params)}` : "";
  return fetchApi(`/products${queryString}`);
}

export async function getProduct(slug: string) {
  return fetchApi(`/products/${slug}`);
}

export async function getFeaturedProducts(limit?: number) {
  const queryString = limit ? `?limit=${limit}` : "";
  return fetchApi(`/products/featured${queryString}`);
}

export async function getProductsByCategory(categorySlug: string, params?: Record<string, string>) {
  const queryParams = new URLSearchParams({ category: categorySlug, ...params });
  return fetchApi(`/products?${queryParams}`);
}

// Cart API
export async function getCart(sessionId: string) {
  return fetchApi(`/cart`, {
    headers: {
      "X-Session-Id": sessionId,
    },
  });
}

export async function addToCart(sessionId: string, item: { productId: string; variationId?: string; quantity: number }) {
  return fetchApi(`/cart/items`, {
    method: "POST",
    headers: {
      "X-Session-Id": sessionId,
    },
    body: JSON.stringify(item),
  });
}

export async function updateCartItem(sessionId: string, itemId: string, quantity: number) {
  return fetchApi(`/cart/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "X-Session-Id": sessionId,
    },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(sessionId: string, itemId: string) {
  return fetchApi(`/cart/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "X-Session-Id": sessionId,
    },
  });
}

export async function clearCart(sessionId: string) {
  return fetchApi(`/cart`, {
    method: "DELETE",
    headers: {
      "X-Session-Id": sessionId,
    },
  });
}

// Checkout API
export interface CheckoutData {
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    document?: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  };
  paymentMethod: "credit_card" | "pix" | "boleto";
  paymentToken?: string;
  installments?: number;
  couponCode?: string;
  notes?: string;
}

export async function createCheckout(sessionId: string, data: CheckoutData) {
  return fetchApi(`/checkout`, {
    method: "POST",
    headers: {
      "X-Session-Id": sessionId,
    },
    body: JSON.stringify(data),
  });
}

export async function getPaymentMethods() {
  return fetchApi(`/payments/methods`);
}

export async function processPayment(orderId: string, paymentData: { paymentMethod: string; token?: string; installments?: number }) {
  return fetchApi(`/payments/process`, {
    method: "POST",
    body: JSON.stringify({ orderId, ...paymentData }),
  });
}

// Orders API
export async function getOrders(email: string) {
  return fetchApi(`/orders?email=${encodeURIComponent(email)}`);
}

export async function getOrder(orderNumber: string, email: string) {
  return fetchApi(`/orders/${orderNumber}?email=${encodeURIComponent(email)}`);
}

// Shipping API
export async function calculateShipping(zipCode: string, items: { productId: string; quantity: number }[]) {
  return fetchApi(`/shipping/calculate`, {
    method: "POST",
    body: JSON.stringify({ zipCode, items }),
  });
}

// Coupon API
export async function validateCoupon(code: string, subtotal: number) {
  return fetchApi(`/coupons/validate`, {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}
