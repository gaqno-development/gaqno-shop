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
    <div className="mt-6">
      <h3 className="font-medium mb-3">Opções de Frete</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <ShippingRadio
            key={option.id}
            option={option}
            isSelected={selected?.id === option.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

interface RadioProps {
  readonly option: ShippingOption;
  readonly isSelected: boolean;
  readonly onSelect: (option: ShippingOption) => void;
}

function ShippingRadio({ option, isSelected, onSelect }: RadioProps) {
  return (
    <label
      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="shipping"
          checked={isSelected}
          onChange={() => onSelect(option)}
          className="text-blue-600"
        />
        <div>
          <p className="font-medium">{option.name}</p>
          <p className="text-sm text-gray-500">
            Entrega em {option.deliveryTime} dias úteis
          </p>
        </div>
      </div>
      <span className="font-semibold">{formatFreightOrFree(option.price)}</span>
    </label>
  );
}
