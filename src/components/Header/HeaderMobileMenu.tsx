import Link from "next/link";
import type { FormEvent } from "react";
import { HeaderSearch } from "./HeaderSearch";
import { PUBLIC_NAV_ITEMS } from "./constants";

interface HeaderMobileMenuProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly query: string;
  readonly onQueryChange: (next: string) => void;
  readonly onSubmitSearch: (event: FormEvent) => void;
  readonly showOrdersLink: boolean;
  readonly showLoginLink: boolean;
  readonly ordersHref: string;
  readonly loginHref: string;
}

export function HeaderMobileMenu({
  open,
  onClose,
  query,
  onQueryChange,
  onSubmitSearch,
  showOrdersLink,
  showLoginLink,
  ordersHref,
  loginHref,
}: HeaderMobileMenuProps) {
  if (!open) return null;

  return (
    <div className="md:hidden border-t bg-white">
      <div className="px-4 py-4 space-y-4">
        <HeaderSearch
          query={query}
          onChange={onQueryChange}
          onSubmit={onSubmitSearch}
          compact
        />
        <nav className="flex flex-col gap-2">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
          {showOrdersLink && (
            <Link
              href={ordersHref}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Meus Pedidos
            </Link>
          )}
          {showLoginLink && (
            <Link
              href={loginHref}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
