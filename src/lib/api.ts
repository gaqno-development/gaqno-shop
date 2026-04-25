// API configuration - ensure /v1 suffix
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4017";
export const API_URL = rawApiUrl.endsWith("/v1") ? rawApiUrl : `${rawApiUrl.replace(/\/$/, "")}/v1`;
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

let shopTenantSlug: string | null = null;

export function setShopTenantSlug(slug: string | null) {
  shopTenantSlug = slug?.trim() || null;
}

export const MP_CHECKOUT_RETURN_EMAIL_KEY = "mp_checkout_return_email";
export const MP_CHECKOUT_RETURN_ORDER_KEY = "mp_checkout_return_order";

function formatApiErrorPayload(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Request failed";
  }
  const o = payload as Record<string, unknown>;
  const raw = o.message;
  if (typeof raw === "string" && raw.trim()) return raw;
  if (Array.isArray(raw)) {
    const joined = raw.map((x) => String(x)).filter(Boolean).join("; ");
    if (joined) return joined;
  }
  if (typeof o.error === "string" && o.error.trim()) return o.error;
  return "Request failed";
}

export function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = R2_PUBLIC_URL.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  if (!cleanPath) return null;
  return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
}

function getTenantHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (shopTenantSlug) {
    headers["X-Tenant-Slug"] = shopTenantSlug;
  }
  if (typeof window !== "undefined") {
    headers["X-Tenant-Domain"] = window.location.host;
  }
  return headers;
}

// API client
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Ensure endpoint starts with / and prepend /v1
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${normalizedEndpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getTenantHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(formatApiErrorPayload(error) || `API error: ${response.status}`);
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

export async function updateCartItem(sessionId: string, productId: string, quantity: number) {
  return fetchApi(`/cart/items/${productId}`, {
    method: "PUT",
    headers: {
      "X-Session-Id": sessionId,
    },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(sessionId: string, productId: string) {
  return fetchApi(`/cart/items/${productId}`, {
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
  customerId?: string;
  sessionId?: string;
  shippingMethodId: string;
  couponCode?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryIsPickup?: boolean;
  items: Array<{
    productId: string;
    quantity: number;
    variationId?: string;
    decorations?: Array<{ decorationId: string; quantity: number }>;
    size?: string;
    notes?: string;
    referenceImageUrl?: string;
  }>;
  shippingAddress: {
    name: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement?: string;
  };
  billingAddress?: {
    name: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement?: string;
  };
  customerNotes?: string;
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

export async function getPaymentMethods(): Promise<string[]> {
  const body = (await fetchApi(`/payments/methods`)) as unknown;
  if (Array.isArray(body)) return body as string[];
  const wrapped = body as { data?: string[] };
  return wrapped.data ?? [];
}

export async function processPayment(
  orderNumber: string,
  paymentData: {
    paymentMethod: string;
    cardToken?: string;
    installments?: number;
    payerEmail?: string;
  },
) {
  return fetchApi(`/payments`, {
    method: "POST",
    body: JSON.stringify({ orderNumber, ...paymentData }),
  });
}

export async function getPaymentStatus(orderNumber: string) {
  return fetchApi(`/payments/status/${encodeURIComponent(orderNumber)}`);
}

// Orders API
export async function getOrder(orderNumber: string, email: string) {
  return fetchApi(`/orders/${orderNumber}?email=${encodeURIComponent(email)}`);
}

// Shipping API
export async function calculateShipping(
  zipCode: string,
  items: { productId: string; quantity: number }[],
  subtotal = 0,
) {
  const body = (await fetchApi(`/shipping/calculate`, {
    method: "POST",
    body: JSON.stringify({ zipCode, items, subtotal }),
  })) as {
    data?: Array<{
      methodId: string;
      name: string;
      price: number;
      days: { min: number; max: number };
    }>;
  };
  const rows = body.data ?? [];
  return rows.map((r) => ({
    id: r.methodId,
    name: r.name,
    price: r.price,
    deliveryTime: r.days?.max ?? r.days?.min ?? 0,
  }));
}

// Coupon API
export async function validateCoupon(code: string, subtotal: number) {
  const body = (await fetchApi(`/coupons/validate`, {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  })) as {
    data?: { valid: boolean; discount: number };
    valid?: boolean;
    discount?: number;
  };
  return body.data ?? { valid: Boolean(body.valid), discount: body.discount ?? 0 };
}

// Bakery — public site settings
export async function getBakerySiteSettings() {
  return fetchApi(`/bakery/site-settings`);
}

// Bakery — decorations catalog (public read)
export async function getBakeryDecorations() {
  return fetchApi(`/bakery/decorations`);
}

// Bakery — reference-image upload (returns { url })
export async function uploadBakeryReferenceImage(
  file: File,
): Promise<{ url: string }> {
  const normalizedEndpoint = "/bakery/assets/upload";
  const url = `${API_URL}${normalizedEndpoint}`;
  const form = new FormData();
  form.append("file", file);
  const headers: Record<string, string> = { ...getTenantHeaders() };
  const response = await fetch(url, {
    method: "POST",
    body: form,
    headers,
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: `HTTP ${response.status}` }));
    throw new Error(error.message || `Upload failed: ${response.status}`);
  }
  return response.json();
}
