import ProductCard from "@/components/product-card";
import type { ProductSummary } from "@/types/catalog";

interface Props {
  readonly products: readonly ProductSummary[];
}

export function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((related) => (
          <ProductCard key={related.id} product={related} />
        ))}
      </div>
    </div>
  );
}
