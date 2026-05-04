import {
  DEFAULT_BAKERY_SIZE_LABELS,
  MAX_BAKERY_SIZE_LABELS,
  TENANT_SETTINGS_BAKERY_SIZE_LABELS_KEY,
} from "@/constants/bakery-size-labels";
import type { ShopTenant } from "@/types/shop-tenant";

function asSettingsRecord(
  value: unknown,
): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function parseLabelList(raw: unknown): readonly string[] | null {
  if (!Array.isArray(raw)) return null;
  const labels = raw
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (labels.length === 0) return null;
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const l of labels) {
    if (seen.has(l)) continue;
    seen.add(l);
    unique.push(l);
    if (unique.length >= MAX_BAKERY_SIZE_LABELS) break;
  }
  return unique;
}

export function resolveBakerySizeLabels(
  tenant: ShopTenant | null | undefined,
): readonly string[] {
  const settings = asSettingsRecord(tenant?.settings ?? null);
  const parsed = parseLabelList(settings?.[TENANT_SETTINGS_BAKERY_SIZE_LABELS_KEY]);
  if (parsed) return parsed;
  return DEFAULT_BAKERY_SIZE_LABELS;
}
