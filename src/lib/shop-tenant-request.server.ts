import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { API_URL } from "@/lib/api";
import type { ShopTenantResolveSnapshot } from "@/types/shop-tenant";
import { shopMetadataFromTenantSnapshot } from "@/lib/shop-tenant-metadata";

async function readRequestHost(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-host")?.split(",")[0]?.trim();
  return (forwarded || h.get("host") || "").trim();
}

async function readRequestOrigin(): Promise<string | undefined> {
  const h = await headers();
  const host = await readRequestHost();
  if (!host) return undefined;
  const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  return `${proto}://${host}`;
}

async function fetchShopTenantResolveUncached(): Promise<ShopTenantResolveSnapshot | null> {
  const host = await readRequestHost();
  if (!host) return null;
  const url = `${API_URL}/tenants/resolve`;
  try {
    const res = await fetch(url, {
      headers: { "X-Tenant-Domain": host },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as ShopTenantResolveSnapshot;
    return body;
  } catch {
    return null;
  }
}

export const getShopTenantResolveForRequest = cache(fetchShopTenantResolveUncached);

export async function buildShopMetadataFromResolve(
  snapshot: ShopTenantResolveSnapshot | null,
): Promise<Metadata> {
  const origin = await readRequestOrigin();
  return shopMetadataFromTenantSnapshot(snapshot, origin);
}
