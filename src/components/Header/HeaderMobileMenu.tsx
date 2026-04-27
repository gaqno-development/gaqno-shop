"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
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

const LINK_CLASS =
  "font-display text-3xl italic tracking-[-0.02em] text-[var(--ink)] py-2 transition-all hover:translate-x-2 hover:text-[var(--tenant-primary)]";

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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="md:hidden border-t border-[var(--glass-border)] bg-[var(--paper)]/95 backdrop-blur-xl"
        >
          <div className="px-6 py-8 space-y-8">
            <HeaderSearch
              query={query}
              onChange={onQueryChange}
              onSubmit={onSubmitSearch}
              compact
            />
            <nav className="flex flex-col">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={LINK_CLASS}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
              {showOrdersLink && (
                <Link href={ordersHref} className={LINK_CLASS} onClick={onClose}>
                  Meus pedidos
                </Link>
              )}
              {showLoginLink && (
                <Link href={loginHref} className={LINK_CLASS} onClick={onClose}>
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
