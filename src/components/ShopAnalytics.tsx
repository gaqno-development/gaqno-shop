"use client";

import Script from "next/script";
import { useTenant } from "@/contexts/tenant-context";

function readMeasurementId(settings: unknown): string | null {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return null;
  }
  const v = (settings as { analyticsMeasurementId?: unknown })
    .analyticsMeasurementId;
  if (typeof v !== "string") return null;
  const t = v.trim();
  return /^G-[A-Z0-9]+$/i.test(t) ? t : null;
}

function readAnalyticsEnabled(settings: unknown): boolean {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return false;
  }
  return Boolean((settings as { analyticsEnabled?: unknown }).analyticsEnabled);
}

export function ShopAnalytics() {
  const { tenant, isLoading } = useTenant();
  if (isLoading || !tenant) return null;
  const settings = tenant.settings ?? {};
  if (!readAnalyticsEnabled(settings)) return null;
  const measurementId = readMeasurementId(settings);
  if (!measurementId) return null;

  const safeId = measurementId.replace(/[^G\-A-Za-z0-9]/g, "");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(safeId)}`}
        strategy="afterInteractive"
      />
      <Script id="shop-ga4" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${safeId}', { send_page_view: true });
`}
      </Script>
    </>
  );
}
