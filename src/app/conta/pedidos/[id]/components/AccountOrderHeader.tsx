import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@gaqno-development/frontcore/components/ui/badge";
import { Button } from "@gaqno-development/frontcore/components/ui/button";
import type { AccountOrderDetail } from "../types";

interface Props {
  readonly order: AccountOrderDetail;
}

export function AccountOrderHeader({ order }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Link href="/conta/pedidos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mt-2">{order.orderNumber}</h1>
        <p className="text-gray-500">
          {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </p>
      </div>
      <Badge variant="default" className="text-sm">
        {order.status}
      </Badge>
    </div>
  );
}
