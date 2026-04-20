import { useTenant } from "@/contexts/tenant-context";
import { formatBRL } from "@/lib/formatters";
import type { ProductPricing } from "@/lib/pricing";

interface Props {
  readonly pricing: ProductPricing;
}

export function ProductPrice({ pricing }: Props) {
  const { tenant } = useTenant();
  return (
    <div className="flex items-baseline gap-3">
      <span
        className="text-3xl font-bold"
        style={{ color: tenant?.primaryColor || "#111827" }}
      >
        {formatBRL(pricing.price)}
      </span>
      {pricing.hasDiscount && pricing.compareAtPrice !== null && (
        <>
          <span className="text-xl text-gray-400 line-through">
            {formatBRL(pricing.compareAtPrice)}
          </span>
          <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
            -{pricing.discountPercentage}%
          </span>
        </>
      )}
    </div>
  );
}
