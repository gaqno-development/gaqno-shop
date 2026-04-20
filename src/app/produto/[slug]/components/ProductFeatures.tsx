import { RotateCcw, Shield, Truck } from "lucide-react";

const FEATURES = [
  { icon: Truck, label: "Entrega Rápida" },
  { icon: Shield, label: "Pagamento Seguro" },
  { icon: RotateCcw, label: "7 Dias para Devolução" },
] as const;

export function ProductFeatures() {
  return (
    <div className="grid grid-cols-3 gap-4 pt-6 border-t">
      {FEATURES.map(({ icon: Icon, label }) => (
        <div key={label} className="text-center">
          <Icon className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <p className="text-xs text-gray-600">{label}</p>
        </div>
      ))}
    </div>
  );
}
