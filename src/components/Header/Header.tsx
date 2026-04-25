"use client";

import { useEffect, useState } from "react";
import { useTenant } from "@/contexts/tenant-context";
import { useCart } from "@/contexts/cart-context";
import { CartDrawer } from "../cart-drawer";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderDesktopNav } from "./HeaderDesktopNav";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { HeaderCartButton } from "./HeaderCartButton";
import { HeaderMobileToggle } from "./HeaderMobileToggle";
import { useAuthNav } from "@/hooks/useAuthNav";
import { useHeaderSearch } from "./hooks/useHeaderSearch";
import { useHeaderMenus } from "./hooks/useHeaderMenus";

const SCROLL_TRIGGER_PX = 16;

function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > SCROLL_TRIGGER_PX);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return scrolled;
}

export function Header() {
  const { tenant, isLoading } = useTenant();
  const isBrandLoading = isLoading && !tenant;
  const { cart } = useCart();
  const nav = useAuthNav();
  const search = useHeaderSearch();
  const menus = useHeaderMenus();
  const scrolled = useScrolled();

  return (
    <>
      <header
        data-scrolled={scrolled}
        className="sticky top-0 z-40 border-b border-[var(--mist)] bg-[var(--paper)]/80 backdrop-blur-xl transition-[padding,background] duration-500 data-[scrolled=true]:bg-[var(--paper)]/95"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-between transition-[height] duration-500 ease-out"
            style={{ height: scrolled ? "64px" : "88px" }}
          >
            <HeaderLogo
              name={tenant?.name}
              logoUrl={tenant?.logoUrl}
              primaryColor={tenant?.primaryColor}
              compact={scrolled}
              isBrandLoading={isBrandLoading}
            />
            <HeaderSearch
              query={search.query}
              onChange={search.setQuery}
              onSubmit={search.submit}
              className="hidden md:flex flex-1 max-w-sm mx-10"
            />
            <HeaderDesktopNav
              showOrdersLink={nav.showOrdersLink}
              showLoginLink={nav.showLoginLink}
              ordersHref={nav.ordersHref}
              loginHref={nav.loginHref}
            />
            <div className="flex items-center gap-2 md:gap-4">
              <HeaderCartButton
                itemCount={cart?.itemCount ?? 0}
                onOpen={menus.openCart}
              />
              <HeaderMobileToggle
                open={menus.isMobileMenuOpen}
                onToggle={menus.toggleMobileMenu}
              />
            </div>
          </div>
        </div>
        <HeaderMobileMenu
          open={menus.isMobileMenuOpen}
          onClose={menus.closeMobileMenu}
          query={search.query}
          onQueryChange={search.setQuery}
          onSubmitSearch={search.submit}
          showOrdersLink={nav.showOrdersLink}
          showLoginLink={nav.showLoginLink}
          ordersHref={nav.ordersHref}
          loginHref={nav.loginHref}
        />
      </header>
      <CartDrawer isOpen={menus.isCartOpen} onClose={menus.closeCart} />
    </>
  );
}
