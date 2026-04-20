import { CreditCard, QrCode, Receipt } from "lucide-react";
import type { PaymentMethod } from "../types";

interface PaymentOption {
  readonly value: PaymentMethod;
  readonly icon: typeof CreditCard;
  readonly title: string;
  readonly description: string;
}

const PAYMENT_OPTIONS: readonly PaymentOption[] = [
  {
    value: "credit_card",
    icon: CreditCard,
    title: "Cartão de Crédito",
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
    title: "Boleto Bancário",
    description: "Vencimento em 3 dias",
  },
];

interface Props {
  readonly selected: PaymentMethod;
  readonly onSelect: (value: PaymentMethod) => void;
}

export function PaymentSection({ selected, onSelect }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
          3
        </span>
        Pagamento
      </h2>
      <div className="space-y-3">
        {PAYMENT_OPTIONS.map((option) => (
          <PaymentRadio
            key={option.value}
            option={option}
            isSelected={selected === option.value}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

interface RadioProps {
  readonly option: PaymentOption;
  readonly isSelected: boolean;
  readonly onSelect: (value: PaymentMethod) => void;
}

function PaymentRadio({ option, isSelected, onSelect }: RadioProps) {
  const Icon = option.icon;
  return (
    <label
      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <input
        type="radio"
        name="payment"
        checked={isSelected}
        onChange={() => onSelect(option.value)}
        className="text-blue-600"
      />
      <Icon className="h-6 w-6 text-gray-600" />
      <div>
        <p className="font-medium">{option.title}</p>
        <p className="text-sm text-gray-500">{option.description}</p>
      </div>
    </label>
  );
}
