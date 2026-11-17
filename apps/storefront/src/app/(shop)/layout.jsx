import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Suspense } from 'react';
import FloatingCompareBar from '@/components/product/FloatingCompareBar';
import AiChatWidget from '@/features/ai-assistant/components/AiChatWidget';

export default function ShopLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="min-w-0 flex-1">{children}</main>
      <Footer />
      <Suspense fallback={null}><FloatingCompareBar /></Suspense>
      <Suspense fallback={null}><AiChatWidget /></Suspense>
    </div>
  );
}