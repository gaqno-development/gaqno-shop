"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Search, User, Store } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { useCart } from "@/contexts/cart-context";
import { CartDrawer } from "./cart-drawer";

export function Header() {
  const { tenant } = useTenant();
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/produtos?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header 
        className="sticky top-0 z-40 shadow-sm"
        style={{ backgroundColor: tenant?.bgColor || "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {tenant?.logoUrl ? (
                <img 
                  src={tenant.logoUrl} 
                  alt={tenant.name}
                  className="h-10 w-auto"
                />
              ) : (
                <h1 
                  className="text-xl font-bold"
                  style={{ color: tenant?.primaryColor || "#111827" }}
                >
                  {tenant?.name || "Gaqno Shop"}
                </h1>
              )}
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Início
              </Link>
              <Link 
                href="/produtos" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Produtos
              </Link>
              <Link 
                href="/pedidos" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                Meus Pedidos
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart && cart.itemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ backgroundColor: tenant?.primaryColor || "#e11d48" }}
                  >
                    {cart.itemCount > 9 ? "9+" : cart.itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>

              <nav className="flex flex-col gap-2">
                <Link 
                  href="/" 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Início
                </Link>
                <Link 
                  href="/produtos" 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produtos
                </Link>
                <Link 
                  href="/pedidos" 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Meus Pedidos
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
