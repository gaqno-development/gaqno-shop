"use client";

import { useState, type FormEvent } from "react";

export interface HeaderSearchState {
  readonly query: string;
  setQuery: (next: string) => void;
  submit: (event: FormEvent) => void;
}

export function useHeaderSearch(): HeaderSearchState {
  const [query, setQuery] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    window.location.href = `/produtos?search=${encodeURIComponent(trimmed)}`;
  };

  return { query, setQuery, submit };
}
