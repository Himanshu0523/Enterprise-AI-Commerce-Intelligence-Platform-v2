import React from 'react';
import AccountSidebar from '@/components/account/SidebarNav';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function AccountLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="w-full md:w-64 flex-shrink-0">
            <AccountSidebar />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}