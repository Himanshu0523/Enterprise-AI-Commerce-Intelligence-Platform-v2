import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ContentLayout({ children }) {
  return <div className="flex min-h-screen flex-col"><Suspense fallback={<div className="h-[102px] border-b border-[#e5e4dc] bg-[#f8f7f2]"/>}><Header/></Suspense><main className="min-w-0 flex-1">{children}</main><Footer/></div>;
}