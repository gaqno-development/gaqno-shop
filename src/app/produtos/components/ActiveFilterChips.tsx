import { X } from "lucide-react";
import type { Category } from "@/types/catalog";
import type { PriceRange } from "../constants";

interface Props {
  readonly selectedCategory: string;
  readonly categories: readonly Category[];
  readonly priceRange: PriceRange;
  readonly searchQuery: string;
  readonly onClearCategory: () => void;
  readonly onClearPriceRange: () => void;
  readonly onClearSearch: () => void;
  readonly hasActiveFilters: boolean;
}

export function ActiveFilterChips({
  selectedCategory,
  categories,
  priceRange,
  searchQuery,
  onClearCategory,
  onClearPriceRange,
  onClearSearch,
  hasActiveFilters,
}: Props) {
  if (!hasActiveFilters) return null;
  const categoryName =
    categories.find((c) => c.slug === selectedCategory)?.name ?? selectedCategory;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {selectedCategory && (
        <Chip label={`Categoria: ${categoryName}`} onRemove={onClearCategory} />
      )}
      {(priceRange.min || priceRange.max) && (
        <Chip
          label={`Preço: R$ ${priceRange.min || "0"} - R$ ${priceRange.max || "∞"}`}
          onRemove={onClearPriceRange}
        />
      )}
      {searchQuery && (
        <Chip label={`Busca: ${searchQuery}`} onRemove={onClearSearch} />
      )}
    </div>
  );
}

interface ChipProps {
  readonly label: string;
  readonly onRemove: () => void;
}

function Chip({ label, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
      {label}
      <button onClick={onRemove}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
