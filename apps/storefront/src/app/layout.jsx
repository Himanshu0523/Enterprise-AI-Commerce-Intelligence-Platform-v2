import { Suspense } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { CartProvider } from '@/lib/contexts/CartContext';
import { WishlistProvider } from '@/lib/contexts/WishlistContext';
import { CheckoutProvider } from '@/lib/contexts/CheckoutContext';
import { QuickViewProvider } from '@/lib/contexts/QuickViewContext';
import FloatingCompareBar from '@/components/product/FloatingCompareBar';
import AiChatWidget from '@/features/ai-assistant/components/AiChatWidget';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Storefront | Product Discovery',
  description: 'Explore products, compare details and discover items through an intelligent commerce experience.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CheckoutProvider>
                <QuickViewProvider>
                  {children}
                  <Suspense fallback={null}><FloatingCompareBar /></Suspense>
                  <Suspense fallback={null}><AiChatWidget /></Suspense>
                </QuickViewProvider>
              </CheckoutProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}