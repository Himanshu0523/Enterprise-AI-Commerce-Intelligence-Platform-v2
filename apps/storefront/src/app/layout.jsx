import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { CartProvider } from '@/lib/contexts/CartContext';
import { WishlistProvider } from '@/lib/contexts/WishlistContext';
import { CheckoutProvider } from '@/lib/contexts/CheckoutContext';
import { QuickViewProvider } from '@/lib/contexts/QuickViewContext';
import FloatingCompareBar from '@/components/product/FloatingCompareBar';
import AiChatWidget from '@/features/ai-assistant/components/AiChatWidget';

/**
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: 'Enterprise AI Commerce Platform | Premium Storefront',
  description: 'Next-generation AI-powered e-commerce shopping experience with real-time recommendations and instant checkout.',
};

/**
 * Root Layout Component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CheckoutProvider>
                <QuickViewProvider>
                  {children}
                  <FloatingCompareBar />
                  <AiChatWidget />
                </QuickViewProvider>
              </CheckoutProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}