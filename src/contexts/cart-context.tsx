"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeCartItem as removeCartItemApi,
  clearCart as clearServerCart,
} from "@/lib/api";
import type { OrderItemBakeryMeta } from "@/types/bakery";

export interface CartItem {
  productId: string;
  variationId?: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  attributes?: Record<string, string>;
  total: number;
  bakeryMeta?: OrderItemBakeryMeta;
}

export interface CartSummary {
  itemCount: number;
  uniqueItems: number;
  subtotal: number;
  items: CartItem[];
}

interface CartContextType {
  cart: CartSummary | null;
  isLoading: boolean;
  isCartMutating: boolean;
  sessionId: string;
  addItem: (
    product: any,
    quantity: number,
    variation?: any,
    bakeryMeta?: OrderItemBakeryMeta,
  ) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SESSION_ID_KEY = "shop_session_id";

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

function toCartSummary(data: { items?: unknown }): CartSummary {
  const raw = Array.isArray(data?.items) ? data.items : [];
  if (raw.length === 0) {
    return {
      itemCount: 0,
      uniqueItems: 0,
      subtotal: 0,
      items: [],
    };
  }
  const items = raw.map((item: any) => ({
    ...item,
    total: item.price * item.quantity,
  })) as CartItem[];
  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    uniqueItems: items.length,
    subtotal: items.reduce((sum, item) => sum + item.total, 0),
    items,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartMutating, setIsCartMutating] = useState(false);
  const [sessionId] = useState(getSessionId);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCart(sessionId);
      setCart(toCartSummary(data as { items?: unknown }));
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (
    product: any,
    quantity: number,
    variation?: any,
    bakeryMeta?: OrderItemBakeryMeta,
  ) => {
    const item = {
      productId: product.id,
      variationId: variation?.id,
      quantity,
      ...(bakeryMeta ? { bakeryMeta } : {}),
    };

    await apiAddToCart(sessionId, item);
    await refreshCart();
  };

  const removeItem = async (productId: string) => {
    setIsCartMutating(true);
    try {
      await removeCartItemApi(sessionId, productId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove cart line:", error);
    } finally {
      setIsCartMutating(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setIsCartMutating(true);
    try {
      if (quantity <= 0) {
        await removeCartItemApi(sessionId, productId);
      } else {
        await updateCartItem(sessionId, productId, quantity);
      }
      await refreshCart();
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    } finally {
      setIsCartMutating(false);
    }
  };

  const clearCart = async () => {
    setIsCartMutating(true);
    try {
      await clearServerCart(sessionId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsCartMutating(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartMutating,
        sessionId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
