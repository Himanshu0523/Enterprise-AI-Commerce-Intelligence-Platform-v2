import AccountSidebar from '@/components/account/SidebarNav';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AccountLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
          <div className="min-w-0 lg:sticky lg:top-36"><AccountSidebar/></div>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}