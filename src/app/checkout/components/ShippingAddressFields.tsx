import { BRAZIL_STATES } from "../constants";
import type { CheckoutAddress } from "../types";

interface Props {
  readonly address: CheckoutAddress;
  readonly onChange: (partial: Partial<CheckoutAddress>) => void;
}

export function ShippingAddressFields({ address, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">CEP *</label>
        <input
          type="text"
          value={address.zip}
          onChange={(e) => onChange({ zip: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          maxLength={8}
          required
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Endereço *</label>
        <input
          type="text"
          value={address.address1}
          onChange={(e) => onChange({ address1: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Número/Complemento</label>
        <input
          type="text"
          value={address.address2 ?? ""}
          onChange={(e) => onChange({ address2: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Cidade *</label>
        <input
          type="text"
          value={address.city}
          onChange={(e) => onChange({ city: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Estado *</label>
        <select
          value={address.province}
          onChange={(e) => onChange({ province: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Selecione</option>
          {BRAZIL_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
