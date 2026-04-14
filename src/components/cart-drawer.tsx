"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { useCart } from "@/contexts/cart-context";
import { R2_PUBLIC_URL } from "@/lib/api";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { tenant } = useTenant();
  const { cart, removeItem, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho
            {cart && cart.itemCount > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({cart.itemCount} {cart.itemCount === 1 ? "item" : "itens"})
              </span>
            )}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-gray-500 mb-4">
                Adicione produtos para começar a comprar
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  {/* Image */}
                  <div className="h-20 w-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl ? `${R2_PUBLIC_URL}/${item.imageUrl}` : "/placeholder-product.png"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-product.png";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    {item.attributes && Object.entries(item.attributes).length > 0 && (
                      <p className="text-xs text-gray-500">
                        {Object.entries(item.attributes).map(([key, value]) => `${key}: ${value}`).join(", ")}
                      </p>
                    )}
                    <p className="font-semibold mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>R$ {cart.subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <p className="text-sm text-gray-500">
              Frete e impostos calculados no checkout
            </p>
            <Link
              href="/carrinho"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 text-white font-medium rounded-lg transition-colors"
              style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
            >
              Finalizar Compra
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
