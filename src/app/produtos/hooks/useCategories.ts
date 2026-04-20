import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types/catalog";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getCategories();
        if (!cancelled) setCategories(data ?? []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
