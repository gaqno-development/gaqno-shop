import type { ReactNode } from "react";

interface SectionFrameProps {
  readonly number: string;
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}

export function SectionFrame({
  number,
  title,
  description,
  children,
}: SectionFrameProps) {
  return (
    <section>
      <header className="mb-8 flex items-end justify-between gap-6 border-b border-[var(--glass-border)] pb-5">
        <div className="space-y-2">
          <span className="eyebrow">{number} · Checkout</span>
          <h2
            className="font-display text-[clamp(1.8rem,3.5vw,2.4rem)] leading-tight tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80' }}
          >
            <em className="italic font-[430]">{title}.</em>
          </h2>
          {description && (
            <p className="max-w-md text-[0.9rem] text-[var(--muted)]">
              {description}
            </p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}
