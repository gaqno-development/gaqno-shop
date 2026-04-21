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
    <div className="mb-10 flex flex-wrap gap-2">
      {selectedCategory && (
        <Chip label={`Categoria · ${categoryName}`} onRemove={onClearCategory} />
      )}
      {(priceRange.min || priceRange.max) && (
        <Chip
          label={`R$ ${priceRange.min || "0"} – ${priceRange.max || "∞"}`}
          onRemove={onClearPriceRange}
        />
      )}
      {searchQuery && (
        <Chip label={`Busca · ${searchQuery}`} onRemove={onClearSearch} />
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
    <span className="group inline-flex items-center gap-2 rounded-full border border-[var(--mist)] bg-[var(--tenant-primary)]/5 px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--ink)]">
      {label}
      <button
        onClick={onRemove}
        aria-label="Remover filtro"
        className="flex h-4 w-4 items-center justify-center rounded-full text-[var(--muted)] transition-colors group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)]"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
