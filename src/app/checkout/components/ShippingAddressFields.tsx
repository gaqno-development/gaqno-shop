import { BRAZIL_STATES } from "../constants";
import type { CheckoutAddress } from "../types";
import { EditorialInput } from "./EditorialInput";

interface Props {
  readonly address: CheckoutAddress;
  readonly onChange: (partial: Partial<CheckoutAddress>) => void;
}

export function ShippingAddressFields({ address, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
      <EditorialInput
        label="CEP *"
        value={address.zip}
        onChange={(zip) => onChange({ zip })}
        maxLength={8}
        required
        className="md:col-span-2"
      />
      <EditorialInput
        label="Endereço *"
        value={address.address1}
        onChange={(address1) => onChange({ address1 })}
        required
        className="md:col-span-2"
      />
      <EditorialInput
        label="Número / complemento"
        value={address.address2 ?? ""}
        onChange={(address2) => onChange({ address2 })}
      />
      <EditorialInput
        label="Bairro *"
        value={address.neighborhood}
        onChange={(neighborhood) => onChange({ neighborhood })}
        required
        className="md:col-span-2"
      />
      <EditorialInput
        label="Cidade *"
        value={address.city}
        onChange={(city) => onChange({ city })}
        required
      />
      <label className="group block md:col-span-2">
        <span className="block font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[var(--muted)]">
          Estado *
        </span>
        <select
          value={address.province}
          onChange={(e) => onChange({ province: e.target.value })}
          required
          className="mt-2 w-full appearance-none border-b border-[var(--glass-border)] bg-transparent px-0 py-3 text-[0.95rem] text-[var(--ink)] transition-colors focus:border-[var(--tenant-primary)] focus:outline-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23111' stroke-width='1.2'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0 center",
          }}
        >
          <option value="">Selecione</option>
          {BRAZIL_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
