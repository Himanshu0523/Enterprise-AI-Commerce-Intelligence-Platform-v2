'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ShieldAlert, Database, ArrowLeft } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const roles = user?.roles || [];
  const canManage = roles.includes('admin') || roles.includes('seller');

  if (isLoading) return <main className="page-shell"><div className="surface-card px-6 py-20 text-center text-sm text-[#879087]">Checking account permissions…</div></main>;
  if (!user || !canManage) return <main className="page-shell"><div className="surface-card mx-auto max-w-xl px-6 py-16 text-center"><ShieldAlert size={30} className="mx-auto text-[#9b5147]"/><h1 className="editorial-heading mt-4 text-3xl">Access restricted.</h1><p className="mt-3 text-xs leading-6 text-[#788078]">This area is available only to accounts with an administrator or seller role.</p><Link href="/account" className="primary-action mt-6"><ArrowLeft size={14}/> Back to account</Link></div></main>;

  return <main className="page-shell"><header className="mb-8 border-b border-[#e5e4dc] pb-6"><p className="editorial-kicker">Platform administration</p><h1 className="page-title mt-3">Admin workspace.</h1><p className="page-description">Signed in as {user.email}. Administrative data controls are not connected to this storefront yet.</p></header><section className="surface-card max-w-2xl p-7"><div className="flex items-start gap-4"><span className="grid h-11 w-11 place-items-center bg-[#e8eee7] text-[#315b49]"><Database size={19}/></span><div><h2 className="text-sm font-semibold">Admin service not connected.</h2><p className="mt-2 text-xs leading-6 text-[#788078]">No product-management, user-management or revenue analytics endpoints are currently wired into this interface. Live metrics and action buttons have been removed rather than showing sample data.</p><Link href="/products" className="mt-4 inline-flex text-xs font-semibold text-[#315b49]">Open storefront catalogue <ArrowLeft size={13} className="ml-1 rotate-180"/></Link></div></div></section></main>;
}