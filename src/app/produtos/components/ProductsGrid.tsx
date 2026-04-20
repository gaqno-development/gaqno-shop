import ProductCard from "@/components/product-card";
import type { ProductSummary } from "@/types/catalog";

interface Props {
  readonly products: readonly ProductSummary[];
  readonly isLoading: boolean;
}

export function ProductsGrid({ products, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
        ))}
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
        <p className="text-gray-400">Tente ajustar os filtros</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
