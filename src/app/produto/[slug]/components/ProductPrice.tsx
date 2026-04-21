import { formatBRL } from "@/lib/formatters";
import type { ProductPricing } from "@/lib/pricing";

interface Props {
  readonly pricing: ProductPricing;
}

export function ProductPrice({ pricing }: Props) {
  return (
    <div className="flex items-baseline gap-5">
      <span className="font-mono tabular text-[clamp(2.5rem,4vw,3.2rem)] leading-none text-[var(--ink)]">
        {formatBRL(pricing.price)}
      </span>
      {pricing.hasDiscount && pricing.compareAtPrice !== null && (
        <>
          <span className="font-mono tabular text-lg text-[var(--muted)] line-through">
            {formatBRL(pricing.compareAtPrice)}
          </span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--tenant-primary)]">
            −{pricing.discountPercentage}% off
          </span>
        </>
      )}
    </div>
  );
}
