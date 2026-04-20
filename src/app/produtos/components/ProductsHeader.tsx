import { useTenant } from "@/contexts/tenant-context";

interface Props {
  readonly searchQuery: string;
  readonly isLoading: boolean;
  readonly productsCount: number;
}

export function ProductsHeader({ searchQuery, isLoading, productsCount }: Props) {
  const { tenant } = useTenant();
  return (
    <div className="mb-8">
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: tenant?.primaryColor || "#111827" }}
      >
        {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos"}
      </h1>
      <p className="text-gray-600">
        {isLoading ? "Carregando..." : `${productsCount} produtos encontrados`}
      </p>
    </div>
  );
}
