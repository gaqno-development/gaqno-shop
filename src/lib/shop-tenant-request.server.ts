import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { API_URL } from "@/lib/api";
import type { ShopTenantResolveSnapshot } from "@/types/shop-tenant";
import { shopMetadataFromTenantSnapshot } from "@/lib/shop-tenant-metadata";

function normalizeHost(rawHost: string): string {
  const base = rawHost.trim().toLowerCase();
  if (!base) return "";
  const withoutPort = base.split(":")[0]?.trim() ?? "";
  return withoutPort;
}

async function readRequestHost(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-host")?.split(",")[0]?.trim();
  return normalizeHost(forwarded || h.get("host") || "");
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

  const tryResolve = async (domain: string): Promise<ShopTenantResolveSnapshot | null> => {
    const url = `${API_URL}/tenants/resolve`;
    const res = await fetch(url, {
      headers: { "X-Tenant-Domain": domain },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as ShopTenantResolveSnapshot;
    return body;
  };

  try {
    const primary = await tryResolve(host);
    if (primary?.tenant) return primary;
    if (host.startsWith("www.")) {
      return tryResolve(host.replace(/^www\./, ""));
    }
    return primary;
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
