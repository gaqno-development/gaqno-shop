import { ShoppingCart } from "lucide-react";
import { DEFAULT_CART_BADGE_COLOR } from "./constants";

interface HeaderCartButtonProps {
  readonly itemCount: number;
  readonly badgeColor?: string | null;
  readonly onOpen: () => void;
}

export function HeaderCartButton({
  itemCount,
  badgeColor,
  onOpen,
}: HeaderCartButtonProps) {
  const showBadge = itemCount > 0;
  const displayCount = itemCount > 9 ? "9+" : String(itemCount);

  return (
    <button
      onClick={onOpen}
      className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="h-6 w-6" />
      {showBadge && (
        <span
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
          style={{ backgroundColor: badgeColor ?? DEFAULT_CART_BADGE_COLOR }}
        >
          {displayCount}
        </span>
      )}
    </button>
  );
}
