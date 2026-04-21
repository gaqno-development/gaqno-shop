import Link from "next/link";
import { User, LogIn } from "lucide-react";
import { PUBLIC_NAV_ITEMS } from "./constants";

interface HeaderDesktopNavProps {
  readonly showOrdersLink: boolean;
  readonly showLoginLink: boolean;
  readonly ordersHref: string;
  readonly loginHref: string;
}

const LINK_CLASS =
  "link-underline font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[var(--ink)] hover:text-[var(--tenant-primary)] transition-colors";

export function HeaderDesktopNav({
  showOrdersLink,
  showLoginLink,
  ordersHref,
  loginHref,
}: HeaderDesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {PUBLIC_NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className={LINK_CLASS}>
          {item.label}
        </Link>
      ))}
      {showOrdersLink && (
        <Link href={ordersHref} className={LINK_CLASS}>
          <User className="h-3.5 w-3.5" aria-hidden />
          Meus Pedidos
        </Link>
      )}
      {showLoginLink && (
        <Link href={loginHref} className={LINK_CLASS}>
          <LogIn className="h-3.5 w-3.5" aria-hidden />
          Entrar
        </Link>
      )}
    </nav>
  );
}
