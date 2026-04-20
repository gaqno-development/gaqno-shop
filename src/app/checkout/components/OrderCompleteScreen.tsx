import Link from "next/link";
import { Check } from "lucide-react";

interface Props {
  readonly orderNumber: string;
  readonly email: string;
}

export function OrderCompleteScreen({ orderNumber, email }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-12 w-12 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Pedido Confirmado!</h1>
      <p className="text-gray-600 mb-2">Obrigado pela sua compra.</p>
      <p className="text-lg font-semibold mb-8">Número do pedido: {orderNumber}</p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/"
          className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Continuar Comprando
        </Link>
        <Link
          href={`/pedidos?email=${encodeURIComponent(email)}`}
          className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Ver Meus Pedidos
        </Link>
      </div>
    </div>
  );
}
