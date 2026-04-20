import Link from "next/link";
import { useTenant } from "@/contexts/tenant-context";

export function ProductNotFound() {
  const { tenant } = useTenant();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
      <p className="text-gray-600 mb-8">
        O produto que você está procurando não existe.
      </p>
      <Link
        href="/produtos"
        className="px-6 py-3 text-white rounded-lg"
        style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
      >
        Ver todos os produtos
      </Link>
    </div>
  );
}
