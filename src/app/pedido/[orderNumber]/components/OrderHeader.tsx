import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  type OrderDetail,
} from "@/types/order";

interface Props {
  readonly order: OrderDetail;
  readonly email: string;
}

export function OrderHeader({ order, email }: Props) {
  return (
    <>
      <Link
        href={`/pedidos?email=${encodeURIComponent(email)}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar aos pedidos
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pedido #{order.orderNumber}</h1>
          <p className="text-gray-500">
            Realizado em {formatDateTime(order.createdAt)}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status] ?? ""}`}
        >
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>
    </>
  );
}
