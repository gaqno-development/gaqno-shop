import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProductCategoryRef } from "@/types/catalog";

interface Props {
  readonly productName: string;
  readonly category: ProductCategoryRef | null;
}

export function ProductBreadcrumb({ productName, category }: Props) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <Link href="/" className="hover:text-gray-900">
        Início
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/produtos" className="hover:text-gray-900">
        Produtos
      </Link>
      {category && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/produtos?category=${category.slug}`}
            className="hover:text-gray-900"
          >
            {category.name}
          </Link>
        </>
      )}
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900 truncate">{productName}</span>
    </nav>
  );
}
