import { SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS, type SortValue } from "../constants";

interface Props {
  readonly sortBy: SortValue;
  readonly onSortChange: (value: SortValue) => void;
  readonly onToggleFilters: () => void;
}

export function ProductsToolbar({ sortBy, onSortChange, onToggleFilters }: Props) {
  return (
    <div className="mb-10 flex items-center justify-between border-b border-[var(--mist)] pb-5">
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.26em] text-[var(--ink)] transition-colors hover:text-[var(--tenant-primary)] lg:hidden"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
        Filtros
      </button>

      <label className="ml-auto flex items-center gap-4">
        <span className="eyebrow hidden sm:inline">Ordenar</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortValue)}
          className="appearance-none border-b border-[var(--ink)] bg-transparent pb-1 pr-4 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--ink)] focus:outline-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23111' stroke-width='1.2'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0 center",
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
