import { formatCurrency } from "@/lib/utils";
import type { OrderCustomer, OrderDetail } from "@/types/order";

interface Props {
  readonly order: OrderDetail;
}

export function OrderSummaryCard({ order }: Props) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Resumo</h2>

      <div className="space-y-2 mb-4">
        <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
        <SummaryRow
          label="Frete"
          value={
            order.shippingAmount === 0 ? "Grátis" : formatCurrency(order.shippingAmount)
          }
        />
        {order.taxAmount > 0 && (
          <SummaryRow label="Impostos" value={formatCurrency(order.taxAmount)} />
        )}
        {order.discountAmount > 0 && (
          <SummaryRow
            label="Desconto"
            value={`-${formatCurrency(order.discountAmount)}`}
            className="text-green-600"
          />
        )}
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <CustomerInfo customer={order.customer} />
    </div>
  );
}

interface RowProps {
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

function SummaryRow({ label, value, className = "text-gray-600" }: RowProps) {
  return (
    <div className={`flex justify-between ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function CustomerInfo({ customer }: { readonly customer: OrderCustomer }) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="font-medium mb-2">Informações do Cliente</h3>
      <div className="text-sm text-gray-600">
        <p>
          {customer.firstName} {customer.lastName}
        </p>
        <p>{customer.email}</p>
        <p>{customer.phone}</p>
      </div>
    </div>
  );
}
