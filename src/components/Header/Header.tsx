"use client";

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
import { DEFAULT_BG_COLOR } from "./constants";

export function Header() {
  const { tenant } = useTenant();
  const { cart } = useCart();
  const nav = useAuthNav();
  const search = useHeaderSearch();
  const menus = useHeaderMenus();

  return (
    <>
      <header
        className="sticky top-0 z-40 shadow-sm"
        style={{ backgroundColor: tenant?.bgColor ?? DEFAULT_BG_COLOR }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <HeaderLogo
              name={tenant?.name}
              logoUrl={tenant?.logoUrl}
              primaryColor={tenant?.primaryColor}
            />
            <HeaderSearch
              query={search.query}
              onChange={search.setQuery}
              onSubmit={search.submit}
              className="hidden md:flex flex-1 max-w-md mx-8"
            />
            <HeaderDesktopNav
              showOrdersLink={nav.showOrdersLink}
              showLoginLink={nav.showLoginLink}
              ordersHref={nav.ordersHref}
              loginHref={nav.loginHref}
            />
            <div className="flex items-center gap-4">
              <HeaderCartButton
                itemCount={cart?.itemCount ?? 0}
                badgeColor={tenant?.primaryColor}
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
