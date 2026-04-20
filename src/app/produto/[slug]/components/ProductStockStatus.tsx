import { Check } from "lucide-react";

interface Props {
  readonly isOutOfStock: boolean;
  readonly isLowStock: boolean;
  readonly quantity: number;
}

export function ProductStockStatus({
  isOutOfStock,
  isLowStock,
  quantity,
}: Props) {
  if (isOutOfStock) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-red-600 font-medium">Fora de estoque</span>
      </div>
    );
  }
  if (isLowStock) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-orange-600 font-medium">
          Apenas {quantity} unidades em estoque
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-green-600 font-medium flex items-center gap-1">
        <Check className="h-4 w-4" />
        Em estoque
      </span>
    </div>
  );
}
