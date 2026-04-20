import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/catalog";

interface Props {
  readonly categories: readonly Category[];
}

export function HomeCategoriesSection({ categories }: Props) {
  if (categories.length === 0) return null;
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Categorias</h2>
          <Link
            href="/produtos"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({ category }: { readonly category: Category }) {
  return (
    <Link
      href={`/produtos?category=${category.slug}`}
      className="group relative aspect-square rounded-2xl overflow-hidden"
    >
      {category.imageUrl ? (
        <img
          src={category.imageUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-white font-bold text-xl">{category.name}</h3>
        {category.description && (
          <p className="text-white/80 text-sm mt-1">{category.description}</p>
        )}
      </div>
    </Link>
  );
}
