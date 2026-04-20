import type { CheckoutAddress, ShippingOption } from "../types";
import { ShippingAddressFields } from "./ShippingAddressFields";
import { ShippingOptionsList } from "./ShippingOptionsList";

interface Props {
  readonly address: CheckoutAddress;
  readonly onAddressChange: (partial: Partial<CheckoutAddress>) => void;
  readonly options: readonly ShippingOption[];
  readonly selectedOption: ShippingOption | null;
  readonly onSelectOption: (option: ShippingOption) => void;
}

export function ShippingSection({
  address,
  onAddressChange,
  options,
  selectedOption,
  onSelectOption,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
          2
        </span>
        Endereço de Entrega
      </h2>
      <ShippingAddressFields address={address} onChange={onAddressChange} />
      <ShippingOptionsList
        options={options}
        selected={selectedOption}
        onSelect={onSelectOption}
      />
    </div>
  );
}
