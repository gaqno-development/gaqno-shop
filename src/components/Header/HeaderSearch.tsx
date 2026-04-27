"use client";

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
  const size = compact ? "py-2 text-sm" : "py-2.5 text-[0.9rem]";

  return (
    <form onSubmit={onSubmit} className={className}>
      <label className="relative flex w-full items-center">
        <Search
          aria-hidden
          className="absolute left-4 h-4 w-4 text-[var(--muted)] pointer-events-none"
        />
        <input
          type="search"
          placeholder="Busque uma coleção, produto ou tema"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-full border border-[var(--glass-border)] bg-[var(--glass-surface)] pl-11 pr-4 ${size} font-mono tracking-tight text-[var(--ink)] placeholder:text-[var(--muted)] placeholder:font-sans placeholder:tracking-normal transition-all focus:outline-none focus:border-[var(--tenant-primary)] focus:bg-[var(--glass-highlight)] focus:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]`}
        />
      </label>
    </form>
  );
}
