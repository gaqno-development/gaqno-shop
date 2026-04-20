"use client";

import { useState } from "react";

export interface HeaderMenusState {
  readonly isCartOpen: boolean;
  readonly isMobileMenuOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export function useHeaderMenus(): HeaderMenusState {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return {
    isCartOpen,
    isMobileMenuOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleMobileMenu: () => setIsMobileMenuOpen((prev) => !prev),
    closeMobileMenu: () => setIsMobileMenuOpen(false),
  };
}
