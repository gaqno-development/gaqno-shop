import { Search } from "lucide-react";
import type { FormEvent } from "react";

interface HeaderSearchProps {
  readonly query: string;
  readonly onChange: (next: string) => void;
  readonly onSubmit: (event: FormEvent) => void;
  readonly className?: string;
  readonly compact?: boolean;
}

export function HeaderSearch({
  query,
  onChange,
  onSubmit,
  className,
  compact,
}: HeaderSearchProps) {
  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className={
            compact
              ? "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              : "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </form>
  );
}
