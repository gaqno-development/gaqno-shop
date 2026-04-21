import type { CheckoutAddress, ShippingOption } from "../types";
import { SectionFrame } from "./SectionFrame";
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
    <SectionFrame number="02" title="Endereço de entrega">
      <ShippingAddressFields address={address} onChange={onAddressChange} />
      <ShippingOptionsList
        options={options}
        selected={selectedOption}
        onSelect={onSelectOption}
      />
    </SectionFrame>
  );
}
