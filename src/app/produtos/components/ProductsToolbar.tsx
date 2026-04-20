import { SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS, type SortValue } from "../constants";

interface Props {
  readonly sortBy: SortValue;
  readonly onSortChange: (value: SortValue) => void;
  readonly onToggleFilters: () => void;
}

export function ProductsToolbar({ sortBy, onSortChange, onToggleFilters }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onToggleFilters}
        className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <span className="text-sm text-gray-500 hidden sm:inline">Ordenar por:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortValue)}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
