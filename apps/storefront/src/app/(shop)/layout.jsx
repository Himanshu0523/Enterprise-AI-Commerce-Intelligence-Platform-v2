import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/lib/contexts/CartContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
/**
 * Shop Layout Component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function ShopLayout({ children }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}