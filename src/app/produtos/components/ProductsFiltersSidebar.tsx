import { Filter } from "lucide-react";
import type { Category } from "@/types/catalog";
import type { PriceRange } from "../constants";

interface Props {
  readonly visible: boolean;
  readonly categories: readonly Category[];
  readonly selectedCategory: string;
  readonly onSelectCategory: (slug: string) => void;
  readonly priceRange: PriceRange;
  readonly onPriceRangeChange: (range: PriceRange) => void;
  readonly hasActiveFilters: boolean;
  readonly onClear: () => void;
}

export function ProductsFiltersSidebar({
  visible,
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceRangeChange,
  hasActiveFilters,
  onClear,
}: Props) {
  return (
    <aside className={`lg:w-64 ${visible ? "block" : "hidden lg:block"}`}>
      <div className="sticky top-28 space-y-10 pb-10">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.26em] text-[var(--ink)]">
            <Filter className="h-3 w-3" strokeWidth={1.5} />
            Filtros
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="link-underline font-mono text-[0.65rem] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--ink)]"
            >
              Limpar
            </button>
          )}
        </div>

        <CategoriesFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={onSelectCategory}
        />

        <PriceRangeFilter range={priceRange} onChange={onPriceRangeChange} />
      </div>
    </aside>
  );
}

interface CategoriesProps {
  readonly categories: readonly Category[];
  readonly selected: string;
  readonly onSelect: (slug: string) => void;
}

function CategoriesFilter({ categories, selected, onSelect }: CategoriesProps) {
  return (
    <div className="space-y-4 border-t border-[var(--mist)] pt-6">
      <h3 className="eyebrow">Categorias</h3>
      <ul className="space-y-1.5">
        <CategoryOption
          checked={!selected}
          onSelect={() => onSelect("")}
          label="Todas"
        />
        {categories.map((category) => (
          <CategoryOption
            key={category.id}
            checked={selected === category.slug}
            onSelect={() => onSelect(category.slug)}
            label={category.name}
          />
        ))}
      </ul>
    </div>
  );
}

interface OptionProps {
  readonly checked: boolean;
  readonly onSelect: () => void;
  readonly label: string;
}

function CategoryOption({ checked, onSelect, label }: OptionProps) {
  return (
    <li>
      <button
        onClick={onSelect}
        className="group flex w-full items-center gap-3 py-1.5 text-left"
      >
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full transition-all ${checked ? "bg-[var(--tenant-primary)] scale-125" : "bg-[var(--mist)] group-hover:bg-[var(--ink)]"}`}
        />
        <span
          className={`text-[0.95rem] transition-colors ${checked ? "text-[var(--ink)]" : "text-[var(--muted)] group-hover:text-[var(--ink)]"}`}
        >
          {label}
        </span>
      </button>
    </li>
  );
}

interface PriceProps {
  readonly range: PriceRange;
  readonly onChange: (range: PriceRange) => void;
}

function PriceRangeFilter({ range, onChange }: PriceProps) {
  return (
    <div className="space-y-4 border-t border-[var(--mist)] pt-6">
      <h3 className="eyebrow">Preço</h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={range.min}
          onChange={(e) => onChange({ ...range, min: e.target.value })}
          className="w-full border-b border-[var(--mist)] bg-transparent px-0 py-2 font-mono text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--ink)] focus:outline-none"
        />
        <span aria-hidden className="h-[1px] w-4 bg-[var(--mist)]" />
        <input
          type="number"
          placeholder="Max"
          value={range.max}
          onChange={(e) => onChange({ ...range, max: e.target.value })}
          className="w-full border-b border-[var(--mist)] bg-transparent px-0 py-2 font-mono text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--ink)] focus:outline-none"
        />
      </div>
    </div>
  );
}
