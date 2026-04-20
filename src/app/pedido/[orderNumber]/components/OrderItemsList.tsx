import { Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { OrderItem } from "@/types/order";

interface Props {
  readonly items: readonly OrderItem[];
}

export function OrderItemsList({ items }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 py-4 border-b last:border-0">
            <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-full w-full p-4 text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.productName}</h3>
              <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
              <p className="font-semibold mt-1">{formatCurrency(item.total)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
