import { RotateCcw, Shield, Truck, type LucideIcon } from "lucide-react";

interface Feature {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly description: string;
}

const FEATURES: readonly Feature[] = [
  { icon: Truck, label: "Entrega ágil", description: "Frete calculado no checkout." },
  { icon: Shield, label: "Pagamento seguro", description: "Criptografia ponta a ponta." },
  { icon: RotateCcw, label: "7 dias para trocar", description: "Sem perguntas, sem culpa." },
];

export function ProductFeatures() {
  return (
    <div className="mt-2 grid grid-cols-1 divide-y divide-[var(--mist)] border-t border-[var(--mist)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {FEATURES.map(({ icon: Icon, label, description }) => (
        <div key={label} className="flex items-start gap-3 py-5 sm:px-5">
          <Icon
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--ink)]"
            strokeWidth={1.4}
          />
          <div className="space-y-1">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink)]">
              {label}
            </p>
            <p className="text-[0.8rem] leading-snug text-[var(--muted)]">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
