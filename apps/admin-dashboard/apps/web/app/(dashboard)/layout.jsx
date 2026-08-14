'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Tag, Truck,
  BarChart2, Settings, Brain, ChevronDown, ChevronRight,
  Sparkles, TrendingUp, DollarSign, ShieldAlert, PieChart,
  BookOpen, MessageSquareText, Cpu, FileText,
  LogOut, Bell, Menu, X, Store, Warehouse, Star,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/dashboard/products', icon: Package, label: 'Products' },
      { href: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
      { href: '/dashboard/customers', icon: Users, label: 'Customers' },
      { href: '/dashboard/inventory', icon: Warehouse, label: 'Inventory' },
      { href: '/dashboard/reviews', icon: Star, label: 'Reviews' },
      { href: '/dashboard/coupons', icon: Tag, label: 'Coupons' },
      { href: '/dashboard/shipping', icon: Truck, label: 'Shipping' },
      { href: '/dashboard/sellers', icon: Store, label: 'Sellers' },
    ],
  },
  {
    label: 'AI Intelligence',
    icon: Brain,
    items: [
      { href: '/dashboard/ai/recommendations', icon: Sparkles, label: 'Recommendations' },
      { href: '/dashboard/ai/demand-forecast', icon: TrendingUp, label: 'Demand Forecast' },
      { href: '/dashboard/ai/dynamic-pricing', icon: DollarSign, label: 'Dynamic Pricing' },
      { href: '/dashboard/ai/fraud-detection', icon: ShieldAlert, label: 'Fraud Detection' },
      { href: '/dashboard/ai/segmentation', icon: PieChart, label: 'Customer Segmentation' },
      { href: '/dashboard/ai/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
      { href: '/dashboard/ai/assistant', icon: MessageSquareText, label: 'AI Assistant' },
      { href: '/dashboard/ai/models', icon: Cpu, label: 'Model Management' },
      { href: '/dashboard/ai/prompts', icon: FileText, label: 'Prompt Management' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

function NavItem({ item, collapsed }) {
  const pathname = usePathname();
  const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
        active
          ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={17} className="flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

function NavGroup({ group, collapsed }) {
  const pathname = usePathname();
  const isAiGroup = group.label === 'AI Intelligence';
  const hasActive = group.items.some(
    (i) => pathname === i.href || (i.href !== '/dashboard' && pathname.startsWith(i.href))
  );
  const [open, setOpen] = useState(hasActive || isAiGroup);

  return (
    <div className="mb-1">
      {!collapsed && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between px-3 py-1.5 mb-1"
        >
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            {isAiGroup && <Brain size={11} className="text-violet-400" />}
            {group.label}
          </span>
          {open ? <ChevronDown size={13} className="text-slate-600" /> : <ChevronRight size={13} className="text-slate-600" />}
        </button>
      )}
      {(open || collapsed) && (
        <div className="space-y-0.5">
          {group.items.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`flex flex-col bg-[#0f1117] border-r border-white/5 transition-all duration-300 ${
        mobile ? 'w-72 h-full' : collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/5 flex-shrink-0 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
          <Sparkles size={14} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <p className="text-sm font-bold text-white leading-tight">Nexus Admin</p>
            <p className="text-[10px] text-slate-500 leading-tight">Intelligence Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.label} group={group} collapsed={collapsed && !mobile} />
        ))}
      </nav>

      {/* Footer */}
      <div className={`flex-shrink-0 border-t border-white/5 p-3 space-y-1 ${collapsed && !mobile ? 'items-center' : ''}`}>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#0d0f14] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/5 bg-[#0f1117] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/5"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <button
              className="hidden lg:flex rounded-lg p-1.5 text-slate-400 hover:bg-white/5 transition-colors"
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <ChevronRight size={18} /> : <X size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-1.5 text-slate-400 hover:bg-white/5 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-violet-500" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
