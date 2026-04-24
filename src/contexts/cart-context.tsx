"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCart, addToCart as apiAddToCart } from "@/lib/api";
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
  sessionId: string;
  addItem: (
    product: any,
    quantity: number,
    variation?: any,
    bakeryMeta?: OrderItemBakeryMeta,
  ) => Promise<void>;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId] = useState(getSessionId);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCart(sessionId);
      if (data.items) {
        const items = data.items.map((item: any) => ({
          ...item,
          total: item.price * item.quantity,
        }));
        
        setCart({
          itemCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
          uniqueItems: items.length,
          subtotal: items.reduce((sum: number, item: CartItem) => sum + item.total, 0),
          items,
        });
      }
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

  const removeItem = (productId: string) => {
    // TODO: Implement remove API call
    if (cart) {
      const updatedItems = cart.items.filter((item) => item.productId !== productId);
      setCart({
        ...cart,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        uniqueItems: updatedItems.length,
        subtotal: updatedItems.reduce((sum, item) => sum + item.total, 0),
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (cart) {
      const updatedItems = cart.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity, total: item.price * quantity }
          : item
      );
      setCart({
        ...cart,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: updatedItems.reduce((sum, item) => sum + item.total, 0),
      });
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
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
