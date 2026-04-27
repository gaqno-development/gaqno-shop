import type { OrderAddress } from "@/types/order";

interface Props {
  readonly address: OrderAddress;
}

export function OrderShippingAddress({ address }: Props) {
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-[var(--glass-border)] pb-5">
        <span className="eyebrow">Endereço · entrega</span>
      </div>
      <address className="mt-8 space-y-1 text-[1rem] not-italic leading-relaxed text-[var(--ink)]/80">
        <p
          className="font-display text-[1.2rem] italic text-[var(--ink)]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
        >
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address1}</p>
        {address.address2 ? <p>{address.address2}</p> : null}
        <p>
          {address.city}, {address.province} · {address.zip}
        </p>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          {address.country}
        </p>
      </address>
    </section>
  );
}
