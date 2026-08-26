'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown,
  ArrowRight, Sparkles, Activity, ShieldCheck, RefreshCw, Plus,
  Eye, CheckCircle2, Clock, AlertTriangle, ChevronRight, Store, Brain
} from 'lucide-react';

const STATS = [
  {
    title: 'Total Revenue',
    value: '$128,450.00',
    change: '+14.2%',
    isPositive: true,
    subtext: 'vs last month',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/20',
  },
  {
    title: 'Total Orders',
    value: '1,482',
    change: '+8.7%',
    isPositive: true,
    subtext: 'vs last month',
    icon: ShoppingCart,
    color: 'from-violet-500 to-purple-600',
    border: 'border-violet-500/20',
  },
  {
    title: 'Active Customers',
    value: '3,890',
    change: '+18.4%',
    isPositive: true,
    subtext: 'vs last month',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    border: 'border-blue-500/20',
  },
  {
    title: 'Active Products',
    value: '428',
    change: '-1.5%',
    isPositive: false,
    subtext: 'vs last month',
    icon: Package,
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-500/20',
  },
];

const RECENT_ORDERS_FALLBACK = [
  { id: 'ORD-9482', customer: 'Sarah Jenkins', product: 'Wireless Noise-Canceling Headphones', amount: '$299.99', status: 'Delivered', date: '10 mins ago', avatar: 'SJ' },
  { id: 'ORD-9481', customer: 'Alex Rivera', product: 'Ultra-Wide Gaming Monitor 34"', amount: '$649.50', status: 'Processing', date: '35 mins ago', avatar: 'AR' },
  { id: 'ORD-9480', customer: 'Michael Chen', product: 'Ergonomic Mechanical Keyboard', amount: '$159.00', status: 'Shipped', date: '1 hour ago', avatar: 'MC' },
  { id: 'ORD-9479', customer: 'Emma Watson', product: 'Smart Fitness Watch Series 5', amount: '$199.99', status: 'Pending', date: '2 hours ago', avatar: 'EW' },
  { id: 'ORD-9478', customer: 'David Miller', product: 'USB-C Docking Station Dual 4K', amount: '$129.50', status: 'Delivered', date: '4 hours ago', avatar: 'DM' },
];

const SYSTEM_SERVICES = [
  { name: 'API Gateway', port: 8000, status: 'Operational', latency: '24ms' },
  { name: 'Auth Service', port: 5001, status: 'Operational', latency: '18ms' },
  { name: 'Product Service', port: 5002, status: 'Operational', latency: '32ms' },
  { name: 'Order Service', port: 5003, status: 'Operational', latency: '28ms' },
  { name: 'AI Recommendation Service', port: 5004, status: 'Operational', latency: '45ms' },
];

const TOP_PRODUCTS = [
  { name: 'Wireless Headphones Pro', sales: 342, revenue: '$102,558', stock: 45, status: 'In Stock' },
  { name: 'Mechanical RGB Keyboard', sales: 218, revenue: '$34,662', stock: 12, status: 'Low Stock' },
  { name: 'Ergonomic Desk Chair', sales: 184, revenue: '$55,016', stock: 28, status: 'In Stock' },
  { name: '4K Ultra HD Webcam', sales: 156, revenue: '$15,444', stock: 0, status: 'Out of Stock' },
];

export default function DashboardOverviewPage() {
  const [orders, setOrders] = useState(RECENT_ORDERS_FALLBACK);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Try fetching live orders if backend is connected
    fetchLiveOrders();
  }, []);

  const fetchLiveOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/orders', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data.slice(0, 5));
        }
      }
    } catch (err) {
      // Keep default fallback data if API is unreachable
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-900/40 via-indigo-900/20 to-transparent p-6 rounded-2xl border border-violet-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Enterprise Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Administrator</h1>
          <p className="text-sm text-slate-400 mt-1">Here is what is happening across your commerce network today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLiveOrders}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
          <Link
            href="/dashboard/products"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`relative overflow-hidden rounded-2xl bg-[#0f1117] border ${stat.border} p-5 transition-all hover:scale-[1.01] hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{stat.title}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-500">{stat.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Revenue Analytics & AI Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0f1117] border border-white/5 p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-violet-400" />
                Revenue & Sales Performance
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Gross revenue trajectory over selected timeline</p>
            </div>
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    timeRange === range ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative h-64 w-full flex items-end pt-4 pb-2 px-2">
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
            </div>

            {/* Visual SVG Curve */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,160 Q 75,90 150,130 T 300,70 T 450,40 L 500,20 L 500,200 L 0,200 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M 0,160 Q 75,90 150,130 T 300,70 T 450,40 L 500,20"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Highlight Points */}
              <circle cx="150" cy="130" r="5" className="fill-violet-400 stroke-white stroke-2 animate-pulse" />
              <circle cx="300" cy="70" r="5" className="fill-violet-400 stroke-white stroke-2" />
              <circle cx="500" cy="20" r="6" className="fill-emerald-400 stroke-white stroke-2" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/5 mt-4">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* AI Quick Intelligence Insights */}
        <div className="rounded-2xl bg-[#0f1117] border border-white/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain size={18} className="text-violet-400" />
                AI Insights & Alerts
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-violet-500/20 text-violet-300">Live ML</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-start gap-3">
                <Sparkles size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-violet-200">Demand Spike Detected</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">High demand predicted for Wireless Headphones in Electronics (+35% next 7 days).</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-200">Stock Out Risk Alert</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Mechanical Keyboards stock is at 12 units. Auto-reorder suggested.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <ShieldCheck size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-200">Fraud Prevention Active</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Blocked 4 suspicious transactions in the last 24h (99.8% precision score).</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/ai"
            className="mt-6 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all text-center"
          >
            Explore AI Intelligence Hub <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & System Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0f1117] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Orders</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest customer purchases across platform</p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 px-2">Order ID</th>
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">Product</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  let badgeBg = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                  if (order.status === 'Delivered') badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (order.status === 'Shipped') badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                  if (order.status === 'Processing') badgeBg = 'bg-violet-500/10 text-violet-400 border-violet-500/20';
                  if (order.status === 'Pending') badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2 font-mono font-medium text-violet-400">{order.id}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-300">
                            {order.avatar || 'U'}
                          </div>
                          <span className="font-medium text-white">{order.customer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 max-w-[180px] truncate text-slate-400">{order.product}</td>
                      <td className="py-3 px-2 font-semibold text-white">{order.amount}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${badgeBg}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-slate-500">{order.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Microservices System Health */}
        <div className="rounded-2xl bg-[#0f1117] border border-white/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Store size={18} className="text-emerald-400" />
                Service Health
              </h2>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                All Green
              </span>
            </div>

            <div className="space-y-3">
              {SYSTEM_SERVICES.map((srv) => (
                <div key={srv.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-white">{srv.name}</p>
                    <p className="text-[10px] text-slate-500">Port :{srv.port} • {srv.latency}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {srv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Uptime 99.98%</span>
            <Link href="/dashboard/settings" className="hover:text-white transition-colors">
              Manage Gateway →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
