import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui/card";
import { formatBRL } from "@/lib/formatters";
import type { AccountOrderDetail } from "../types";

interface Props {
  readonly order: AccountOrderDetail;
}

export function AccountOrderSummaryCard({ order }: Props) {
  const subtotal = parseFloat(order.subtotal);
  const shipping = parseFloat(order.shippingAmount);
  const discount = parseFloat(order.discountAmount);
  const total = parseFloat(order.total);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Row label="Subtotal" value={formatBRL(subtotal)} />
          <Row label="Frete" value={formatBRL(shipping)} />
          {discount > 0 && (
            <Row
              label="Desconto"
              value={`-${formatBRL(discount)}`}
              valueClassName="text-green-600"
            />
          )}
          <div className="border-t pt-2 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatBRL(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RowProps {
  readonly label: string;
  readonly value: string;
  readonly valueClassName?: string;
}

function Row({ label, value, valueClassName = "" }: RowProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
