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
});

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Enterprise AI Commerce Platform | Intelligent Storefront',
  description: 'An editorial storefront experience built around intelligent product discovery, comparison and shopping interactions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakartaSans.className}>
      <body className="min-h-screen bg-[#f5f4ef] text-[#1c2924] antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CheckoutProvider>
                <QuickViewProvider>
                  {children}
                  <Suspense fallback={null}>
                    <FloatingCompareBar />
                  </Suspense>
                  <Suspense fallback={null}>
                    <AiChatWidget />
                  </Suspense>
                </QuickViewProvider>
              </CheckoutProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}