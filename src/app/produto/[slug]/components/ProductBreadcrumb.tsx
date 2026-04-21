import Link from "next/link";
import type { ProductCategoryRef } from "@/types/catalog";

interface Props {
  readonly productName: string;
  readonly category: ProductCategoryRef | null;
}

export function ProductBreadcrumb({ productName, category }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-10 font-mono text-[0.68rem] uppercase tracking-[0.26em] text-[var(--muted)]"
    >
      <Link href="/" className="hover:text-[var(--ink)]">
        Início
      </Link>
      <span className="mx-2">/</span>
      <Link href="/produtos" className="hover:text-[var(--ink)]">
        Produtos
      </Link>
      {category && (
        <>
          <span className="mx-2">/</span>
          <Link
            href={`/produtos?category=${category.slug}`}
            className="hover:text-[var(--ink)]"
          >
            {category.name}
          </Link>
        </>
      )}
      <span className="mx-2">/</span>
      <span className="truncate text-[var(--ink)]">{productName}</span>
    </nav>
  );
}
