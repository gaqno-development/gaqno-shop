'use client';

import { SessionProvider } from 'next-auth/react';
import { TenantProvider } from '@/contexts/tenant-context';
import { CartProvider } from '@/contexts/cart-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/footer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TenantProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </TenantProvider>
    </SessionProvider>
  );
}