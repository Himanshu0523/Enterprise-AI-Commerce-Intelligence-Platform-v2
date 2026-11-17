'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  LayoutDashboard, ShoppingBag, MapPin, UserRound, Heart, CreditCard,
  Star, ShieldCheck, Bell, SlidersHorizontal, LogOut, ChevronRight,
} from 'lucide-react';

const NAV_GROUPS = [
  { label: 'Overview', items: [{ href: '/account', label: 'Overview', icon: LayoutDashboard, exact: true }] },
  { label: 'Shopping', items: [
    { href: '/account/orders', label: 'My orders', icon: ShoppingBag },
    { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/account/reviews', label: 'My reviews', icon: Star },
  ] },
  { label: 'Your details', items: [
    { href: '/account/profile', label: 'Profile', icon: UserRound },
    { href: '/account/addresses', label: 'Addresses', icon: MapPin },
    { href: '/account/payment-methods', label: 'Payment methods', icon: CreditCard },
  ] },
  { label: 'Preferences & security', items: [
    { href: '/account/notifications', label: 'Notifications', icon: Bell },
    { href: '/account/security', label: 'Security', icon: ShieldCheck },
    { href: '/account/preferences', label: 'Preferences', icon: SlidersHorizontal },
  ] },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const displayName = user?.name || user?.email?.split('@')[0] || 'My account';
  const initials = displayName.trim().charAt(0).toUpperCase() || 'U';

  const isActive = (href, exact) => exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + '/');

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
    } catch (error) {
      // AuthContext clears the browser session even if the revoke request fails.
      console.error('Sign-out request failed; local session was cleared.', error);
    } finally {
      router.replace('/');
      router.refresh();
      setSigningOut(false);
    }
  };

  return (
    <aside className="min-w-0">
      <div className="border border-[#e5e4dc] bg-[#fffefa] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dce5dc] text-sm font-bold text-[#315b49]">{initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[#27362e]">{displayName}</span>
            <span className="mt-1 block truncate text-[11px] text-[#879087]">{user?.email || ''}</span>
          </span>
        </div>
        <p className="mt-4 border-t border-[#e5e4dc] pt-3 text-[9px] font-bold uppercase tracking-[.17em] text-[#899189]">Your account workspace</p>
      </div>

      <nav aria-label="Account navigation" className="mt-3 border border-[#e5e4dc] bg-[#fffefa] p-2 sm:p-3">
        <div className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-4 lg:overflow-visible lg:pb-0">
          {NAV_GROUPS.map((group) => (
            <section key={group.label} className="min-w-max lg:min-w-0">
              <h2 className="hidden px-3 pb-1.5 text-[9px] font-bold uppercase tracking-[.17em] text-[#929990] lg:block">{group.label}</h2>
              <div className="flex gap-1 lg:block lg:space-y-0.5">
                {group.items.map(({ href, label, icon: Icon, exact }) => {
                  const active = isActive(href, exact);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={'group flex min-h-10 items-center gap-2.5 whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold transition lg:w-full lg:gap-3 lg:text-xs ' + (
                        active
                          ? 'bg-[#e8eee7] text-[#315b49]'
                          : 'text-[#66736a] hover:bg-[#f2f2ec] hover:text-[#315b49]'
                      )}
                    >
                      <Icon size={15} className={active ? 'shrink-0 text-[#315b49]' : 'shrink-0 text-[#929990] group-hover:text-[#315b49]'} />
                      <span>{label}</span>
                      {active && <ChevronRight size={13} className="ml-auto hidden lg:block" />}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-2 border-t border-[#e5e4dc] pt-2 lg:mt-4 lg:pt-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="flex min-h-10 w-full items-center gap-3 px-3 py-2.5 text-left text-xs font-semibold text-[#9b5147] transition hover:bg-[#fbf0ed] disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut size={15} />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </nav>
    </aside>
  );
}