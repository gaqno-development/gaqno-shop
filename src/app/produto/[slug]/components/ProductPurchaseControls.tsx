import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";

interface Props {
  readonly quantity: number;
  readonly onDecrement: () => void;
  readonly onIncrement: () => void;
  readonly canIncrement: boolean;
  readonly isOutOfStock: boolean;
  readonly isAddingToCart: boolean;
  readonly onAddToCart: () => void;
}

export function ProductPurchaseControls({
  quantity,
  onDecrement,
  onIncrement,
  canIncrement,
  isOutOfStock,
  isAddingToCart,
  onAddToCart,
}: Props) {
  const { tenant } = useTenant();
  const buttonLabel = isAddingToCart
    ? "Adicionando..."
    : isOutOfStock
      ? "Indisponível"
      : "Adicionar ao Carrinho";
  return (
    <div className="flex items-center gap-4 pt-4 border-t">
      <div className="flex items-center border rounded-lg">
        <button
          onClick={onDecrement}
          className="p-3 hover:bg-gray-100"
          disabled={isOutOfStock}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          onClick={onIncrement}
          className="p-3 hover:bg-gray-100"
          disabled={isOutOfStock || !canIncrement}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={onAddToCart}
        disabled={isOutOfStock || isAddingToCart}
        className="flex-1 py-3 px-6 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
      >
        <ShoppingCart className="h-5 w-5" />
        {buttonLabel}
      </button>
    </div>
  );
}
