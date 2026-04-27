import { formatFreightOrFree } from "@/lib/formatters";
import type { ShippingOption } from "../types";

interface Props {
  readonly options: readonly ShippingOption[];
  readonly selected: ShippingOption | null;
  readonly onSelect: (option: ShippingOption) => void;
}

export function ShippingOptionsList({ options, selected, onSelect }: Props) {
  if (options.length === 0) return null;
  return (
    <div className="mt-10 space-y-3">
      <span className="eyebrow">Opções de frete</span>
      <ul className="divide-y divide-[var(--glass-border)] border-y border-[var(--glass-border)]">
        {options.map((option) => (
          <ShippingRow
            key={option.id}
            option={option}
            isSelected={selected?.id === option.id}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}

interface RowProps {
  readonly option: ShippingOption;
  readonly isSelected: boolean;
  readonly onSelect: (option: ShippingOption) => void;
}

function ShippingRow({ option, isSelected, onSelect }: RowProps) {
  return (
    <li>
      <button
        onClick={() => onSelect(option)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <div className="flex items-center gap-5">
          <span
            aria-hidden
            className={`h-2 w-2 rounded-full transition-all ${isSelected ? "bg-[var(--tenant-primary)] scale-125" : "bg-[var(--mist)]"}`}
          />
          <div>
            <p
              className={`font-display text-[1.1rem] leading-tight ${isSelected ? "text-[var(--ink)]" : "text-[var(--ink)]/80"}`}
            >
              {option.name}
            </p>
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              {option.deliveryTime} dias úteis
            </p>
          </div>
        </div>
        <span className="font-mono tabular text-[0.95rem] text-[var(--ink)]">
          {formatFreightOrFree(option.price)}
        </span>
      </button>
    </li>
  );
}
