'use client';   // ✅ safe to mark as client even without hooks

import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 h-screen">
      <ul>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/cart">Cart</Link></li>
        <li><Link href="/account">Account</Link></li>
      </ul>
    </aside>
  );
}