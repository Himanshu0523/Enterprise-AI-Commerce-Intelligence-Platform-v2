import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ContentLayout({ children }) {
  return <div className="flex min-h-screen flex-col"><Header/><main className="min-w-0 flex-1">{children}</main><Footer/></div>;
}