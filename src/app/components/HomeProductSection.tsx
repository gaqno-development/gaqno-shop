import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import type { ProductSummary } from "@/types/catalog";

interface Props {
  readonly title: string;
  readonly products: readonly ProductSummary[];
  readonly backgroundClassName?: string;
  readonly hideWhenEmpty?: boolean;
}

export function HomeProductSection({
  title,
  products,
  backgroundClassName = "",
  hideWhenEmpty = false,
}: Props) {
  if (hideWhenEmpty && products.length === 0) return null;
  return (
    <section className={`py-16 ${backgroundClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Link
            href="/produtos"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
