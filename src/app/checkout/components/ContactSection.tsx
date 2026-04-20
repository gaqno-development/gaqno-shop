import type { CheckoutCustomer } from "../types";

interface Props {
  readonly customer: CheckoutCustomer;
  readonly onChange: (partial: Partial<CheckoutCustomer>) => void;
}

export function ContactSection({ customer, onChange }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
          1
        </span>
        Contato
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Email *" type="email" value={customer.email} onChange={(email) => onChange({ email })} required />
        <Field label="Telefone *" type="tel" value={customer.phone} onChange={(phone) => onChange({ phone })} required />
        <Field label="Nome *" value={customer.firstName} onChange={(firstName) => onChange({ firstName })} required />
        <Field label="Sobrenome *" value={customer.lastName} onChange={(lastName) => onChange({ lastName })} required />
        <Field label="CPF/CNPJ" value={customer.document ?? ""} onChange={(document) => onChange({ document })} />
      </div>
    </div>
  );
}

interface FieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly type?: string;
  readonly required?: boolean;
}

function Field({ label, value, onChange, type = "text", required }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        required={required}
      />
    </div>
  );
}
