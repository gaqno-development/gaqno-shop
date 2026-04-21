"use client";

import { useEffect, useState } from "react";
import { getBakeryDecorations } from "@/lib/api";
import type { BakeryDecoration } from "@/types/bakery";
import { useTenant } from "@/contexts/tenant-context";

export function useBakeryDecorations() {
  const { featureFlags } = useTenant();
  const isEnabled = Boolean(featureFlags?.featureBakery);
  const [data, setData] = useState<readonly BakeryDecoration[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(isEnabled);

  useEffect(() => {
    if (!isEnabled) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    getBakeryDecorations()
      .then((res) => {
        if (!cancelled && Array.isArray(res)) {
          setData(res.filter((d: BakeryDecoration) => d.isActive));
        }
      })
      .catch(() => {
        if (!cancelled) setData([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEnabled]);

  return { data, isLoading, isEnabled };
}
