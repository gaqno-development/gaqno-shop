export interface PublicNavItem {
  readonly href: string;
  readonly label: string;
}

export const PUBLIC_NAV_ITEMS: readonly PublicNavItem[] = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
];

export const DEFAULT_CART_BADGE_COLOR = "#e11d48";
export const DEFAULT_LOGO_COLOR = "#111827";
export const DEFAULT_BG_COLOR = "#ffffff";
