import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/lib/contexts/CartContext';
import { WishlistProvider } from '@/lib/contexts/WishlistContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function ShopLayout({ children }) {
  return (
    <ProtectedRoute>
      <CartProvider>
        <WishlistProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </ProtectedRoute>
  );
}