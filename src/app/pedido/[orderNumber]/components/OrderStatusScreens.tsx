import Link from "next/link";
import { useTenant } from "@/contexts/tenant-context";

interface Props {
  readonly message: string;
}

export function OrderError({ message }: Props) {
  const { tenant } = useTenant();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
      <p className="text-gray-600 mb-8">{message}</p>
      <Link
        href="/pedidos"
        className="px-6 py-3 text-white rounded-lg"
        style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
      >
        Voltar aos pedidos
      </Link>
    </div>
  );
}

export function OrderLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
    </div>
  );
}
