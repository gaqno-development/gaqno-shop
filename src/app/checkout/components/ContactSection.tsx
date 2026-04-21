import type { CheckoutCustomer } from "../types";
import { SectionFrame } from "./SectionFrame";
import { EditorialInput } from "./EditorialInput";

interface Props {
  readonly customer: CheckoutCustomer;
  readonly onChange: (partial: Partial<CheckoutCustomer>) => void;
}

export function ContactSection({ customer, onChange }: Props) {
  return (
    <SectionFrame number="01" title="Contato">
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        <EditorialInput
          label="Email *"
          type="email"
          value={customer.email}
          onChange={(email) => onChange({ email })}
          required
        />
        <EditorialInput
          label="Telefone *"
          type="tel"
          value={customer.phone}
          onChange={(phone) => onChange({ phone })}
          required
        />
        <EditorialInput
          label="Nome *"
          value={customer.firstName}
          onChange={(firstName) => onChange({ firstName })}
          required
        />
        <EditorialInput
          label="Sobrenome *"
          value={customer.lastName}
          onChange={(lastName) => onChange({ lastName })}
          required
        />
        <EditorialInput
          label="CPF / CNPJ"
          value={customer.document ?? ""}
          onChange={(document) => onChange({ document })}
          className="md:col-span-2"
        />
      </div>
    </SectionFrame>
  );
}
