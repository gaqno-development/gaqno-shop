"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { useCart } from "@/contexts/cart-context";
import { R2_PUBLIC_URL } from "@/lib/api";

export default function CartPage() {
  const { tenant } = useTenant();
  const { cart, removeItem, updateQuantity } = useCart();
  const [couponCode, setCouponCode] = useState("");

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">
            Parece que você ainda não adicionou nenhum produto ao carrinho.
          </p>
          <Link
            href="/produtos"
            className="inline-block px-8 py-3 text-white font-medium rounded-lg transition-colors"
            style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost: number = 0; // Calculate based on address
  const discount: number = 0; // Apply coupon discount
  const total: number = cart.subtotal + shippingCost - discount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex gap-4 p-4 bg-white border rounded-lg">
              {/* Image */}
              <div className="h-24 w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                <Link 
                  href={`/produto/${item.productId}`}
                  className="font-semibold hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
                {item.attributes && Object.entries(item.attributes).length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {Object.entries(item.attributes).map(([key, value]) => `${key}: ${value}`).join(", ")}
                  </p>
                )}
                <p className="font-medium mt-2">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </p>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Total & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-lg">
                      R$ {item.total.toFixed(2).replace(".", ",")}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            ← Continuar comprando
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Cupom de desconto</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Digite o código"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                  Aplicar
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {cart.subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>{shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>-R$ {discount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="pt-4 border-t flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-4 text-white font-medium rounded-lg transition-colors"
              style={{ backgroundColor: tenant?.primaryColor || "#111827" }}
            >
              Finalizar Compra
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Frete grátis para compras acima de R$ 199</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
