import Link from "next/link";
import { User, LogIn } from "lucide-react";
import { PUBLIC_NAV_ITEMS } from "./constants";

interface HeaderDesktopNavProps {
  readonly showOrdersLink: boolean;
  readonly showLoginLink: boolean;
  readonly ordersHref: string;
  readonly loginHref: string;
}

export function HeaderDesktopNav({
  showOrdersLink,
  showLoginLink,
  ordersHref,
  loginHref,
}: HeaderDesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {PUBLIC_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          {item.label}
        </Link>
      ))}
      {showOrdersLink && (
        <Link
          href={ordersHref}
          className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-1"
        >
          <User className="h-4 w-4" />
          Meus Pedidos
        </Link>
      )}
      {showLoginLink && (
        <Link
          href={loginHref}
          className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-1"
        >
          <LogIn className="h-4 w-4" />
          Entrar
        </Link>
      )}
    </nav>
  );
}
