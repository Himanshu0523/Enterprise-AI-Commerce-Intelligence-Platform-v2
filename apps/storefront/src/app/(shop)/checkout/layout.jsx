import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CheckoutLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}