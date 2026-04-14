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
    throw new Error(`API error: ${response.status}`);
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

// Cart API
export async function getCart(sessionId: string) {
  return fetchApi(`/cart`, {
    headers: {
      "X-Session-Id": sessionId,
    },
  });
}

export async function addToCart(sessionId: string, item: any) {
  return fetchApi(`/cart/items`, {
    method: "POST",
    headers: {
      "X-Session-Id": sessionId,
    },
    body: JSON.stringify(item),
  });
}
