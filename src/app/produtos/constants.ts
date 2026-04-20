export interface PriceRange {
  readonly min: string;
  readonly max: string;
}

export const INITIAL_PRICE_RANGE: PriceRange = { min: "", max: "" };

export const PRODUCTS_LIMIT = "24";

export const SORT_OPTIONS = [
  { value: "name", label: "Nome" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "newest", label: "Mais recentes" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
