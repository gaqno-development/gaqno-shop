"use client";

import { useEffect, useState } from "react";
import { getStorefrontSiteSettings } from "@/lib/api";
import type { BakerySiteSettings } from "@/types/bakery";
import { useTenant } from "@/contexts/tenant-context";

export function useBakerySiteSettings() {
  const { featureFlags } = useTenant();
  const isEnabled = Boolean(featureFlags?.featureBakery);
  const [data, setData] = useState<BakerySiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    getStorefrontSiteSettings()
      .then((res) => {
        if (!cancelled) setData(res as BakerySiteSettings);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Falha ao carregar site");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEnabled]);

  return { data, isLoading, error, isEnabled };
}
