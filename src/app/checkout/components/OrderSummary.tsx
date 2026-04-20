import { R2_PUBLIC_URL } from "@/lib/api";
import { formatBRL, formatFreightOrFree } from "@/lib/formatters";
import type { CartSummary } from "@/contexts/cart-context";
import { Lock } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";

interface Props {
  readonly cart: CartSummary;
  readonly shippingCost: number;
  readonly discount: number;
  readonly total: number;
  readonly couponCode: string;
  readonly onCouponChange: (value: string) => void;
  readonly onApplyCoupon: () => void;
  readonly isSubmitting: boolean;
  readonly canSubmit: boolean;
  readonly onSubmit: () => void;
}

export function OrderSummary({
  cart,
  shippingCost,
  discount,
  total,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  isSubmitting,
  canSubmit,
  onSubmit,
}: Props) {
  const { tenant } = useTenant();
  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="h-16 w-16 bg-white rounded overflow-hidden flex-shrink-0">
              <img
                src={item.imageUrl ? `${R2_PUBLIC_URL}/${item.imageUrl}` : "/placeholder-product.png"}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
              <p className="text-sm font-semibold">{formatBRL(item.total)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCouponChange(e.target.value)}
          placeholder="Cupom de desconto"
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
        <button
          onClick={onApplyCoupon}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
        >
          Aplicar
        </button>
      </div>

      <div className="space-y-2 mb-6">
        <TotalRow label="Subtotal" value={formatBRL(cart.subtotal)} />
        <TotalRow label="Frete" value={formatFreightOrFree(shippingCost)} />
        {discount > 0 && (
          <TotalRow
            label="Desconto"
            value={`-${formatBRL(discount)}`}
            className="text-green-600"
          />
        )}
        <div className="pt-4 border-t flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{formatBRL(total)}</span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting || !canSubmit}
        className="w-full py-4 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
      >
        <Lock className="h-4 w-4" />
        {isSubmitting ? "Processando..." : "Finalizar Compra"}
      </button>
      <p className="mt-4 text-center text-xs text-gray-500">
        Pagamento processado com segurança
      </p>
    </div>
  );
}

interface TotalRowProps {
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

function TotalRow({ label, value, className = "text-gray-600" }: TotalRowProps) {
  return (
    <div className={`flex justify-between ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
