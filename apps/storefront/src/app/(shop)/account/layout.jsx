import AccountSidebar from '@/components/account/SidebarNav';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AccountLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="min-w-0"><AccountSidebar/></aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}