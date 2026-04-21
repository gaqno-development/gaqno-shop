import { CreditCard, QrCode, Receipt, type LucideIcon } from "lucide-react";
import type { PaymentMethod } from "../types";
import { SectionFrame } from "./SectionFrame";

interface PaymentOption {
  readonly value: PaymentMethod;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

const PAYMENT_OPTIONS: readonly PaymentOption[] = [
  {
    value: "credit_card",
    icon: CreditCard,
    title: "Cartão de crédito",
    description: "Até 12x sem juros",
  },
  {
    value: "pix",
    icon: QrCode,
    title: "PIX",
    description: "5% de desconto",
  },
  {
    value: "boleto",
    icon: Receipt,
    title: "Boleto bancário",
    description: "Vencimento em 3 dias",
  },
];

interface Props {
  readonly selected: PaymentMethod;
  readonly onSelect: (value: PaymentMethod) => void;
}

export function PaymentSection({ selected, onSelect }: Props) {
  return (
    <SectionFrame number="03" title="Pagamento">
      <ul className="divide-y divide-[var(--mist)] border-y border-[var(--mist)]">
        {PAYMENT_OPTIONS.map((option) => (
          <PaymentRow
            key={option.value}
            option={option}
            isSelected={selected === option.value}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </SectionFrame>
  );
}

interface RowProps {
  readonly option: PaymentOption;
  readonly isSelected: boolean;
  readonly onSelect: (value: PaymentMethod) => void;
}

function PaymentRow({ option, isSelected, onSelect }: RowProps) {
  const Icon = option.icon;
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(option.value)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <div className="flex items-center gap-5">
          <span
            aria-hidden
            className={`h-2 w-2 rounded-full transition-all ${isSelected ? "bg-[var(--tenant-primary)] scale-125" : "bg-[var(--mist)]"}`}
          />
          <Icon
            className="h-5 w-5 text-[var(--ink)]"
            strokeWidth={1.4}
            aria-hidden
          />
          <div>
            <p
              className={`font-display text-[1.1rem] leading-tight ${isSelected ? "text-[var(--ink)]" : "text-[var(--ink)]/80"}`}
            >
              {option.title}
            </p>
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted)]">
              {option.description}
            </p>
          </div>
        </div>
      </button>
    </li>
  );
}
