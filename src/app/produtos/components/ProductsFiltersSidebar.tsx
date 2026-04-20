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
      <div className="bg-white p-6 rounded-lg border sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-sm text-red-500 hover:text-red-600"
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
    <div className="mb-6">
      <h3 className="font-medium mb-3">Categorias</h3>
      <div className="space-y-2">
        <CategoryOption checked={!selected} onSelect={() => onSelect("")} label="Todas" />
        {categories.map((category) => (
          <CategoryOption
            key={category.id}
            checked={selected === category.slug}
            onSelect={() => onSelect(category.slug)}
            label={category.name}
          />
        ))}
      </div>
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
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="category"
        checked={checked}
        onChange={onSelect}
        className="rounded border-gray-300"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

interface PriceProps {
  readonly range: PriceRange;
  readonly onChange: (range: PriceRange) => void;
}

function PriceRangeFilter({ range, onChange }: PriceProps) {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">Preço</h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={range.min}
          onChange={(e) => onChange({ ...range, min: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          placeholder="Max"
          value={range.max}
          onChange={(e) => onChange({ ...range, max: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>
    </div>
  );
}
