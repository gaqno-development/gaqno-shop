import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui/card";
import { formatBRL } from "@/lib/formatters";
import type { AccountOrderItem } from "../types";

interface Props {
  readonly items: readonly AccountOrderItem[];
}

export function AccountOrderItemsList({ items }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderItemRow({ item }: { readonly item: AccountOrderItem }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package className="w-8 h-8" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
      </div>
      <p className="font-medium">{formatBRL(parseFloat(item.price))}</p>
    </div>
  );
}
