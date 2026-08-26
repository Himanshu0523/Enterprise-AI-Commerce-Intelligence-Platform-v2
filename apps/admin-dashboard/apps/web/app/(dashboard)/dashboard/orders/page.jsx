'use client';

import { useState } from 'react';
import {
  ShoppingCart, Search, Filter, Eye, Truck, CheckCircle2,
  Clock, XCircle, ChevronRight, X, User, MapPin, CreditCard, Box
} from 'lucide-react';

const INITIAL_ORDERS = [
  {
    id: 'ORD-9482',
    customer: { name: 'Sarah Jenkins', email: 'sarah.j@example.com', avatar: 'SJ' },
    date: 'Aug 14, 2026 • 10:42 AM',
    total: 299.99,
    status: 'Delivered',
    payment: 'Credit Card (ending 4242)',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR 97477',
    trackingNumber: 'TRK-99281742',
    items: [
      { name: 'Wireless Noise-Canceling Headphones', price: 299.99, qty: 1, sku: 'AUDIO-NC-01' }
    ]
  },
  {
    id: 'ORD-9481',
    customer: { name: 'Alex Rivera', email: 'arivera@example.com', avatar: 'AR' },
    date: 'Aug 14, 2026 • 09:15 AM',
    total: 649.50,
    status: 'Processing',
    payment: 'PayPal',
    shippingAddress: '100 Market St, San Francisco, CA 94105',
    trackingNumber: 'Pending Generation',
    items: [
      { name: 'Ultra-Wide Curved Gaming Monitor 34"', price: 649.50, qty: 1, sku: 'DISP-UW-34' }
    ]
  },
  {
    id: 'ORD-9480',
    customer: { name: 'Michael Chen', email: 'mchen88@example.com', avatar: 'MC' },
    date: 'Aug 13, 2026 • 04:30 PM',
    total: 318.00,
    status: 'Shipped',
    payment: 'Apple Pay',
    shippingAddress: '450 5th Ave, New York, NY 10018',
    trackingNumber: 'TRK-88120491',
    items: [
      { name: 'Ergonomic RGB Mechanical Keyboard', price: 159.00, qty: 2, sku: 'PERI-KB-88' }
    ]
  },
  {
    id: 'ORD-9479',
    customer: { name: 'Emma Watson', email: 'emma.w@example.com', avatar: 'EW' },
    date: 'Aug 13, 2026 • 01:10 PM',
    total: 199.99,
    status: 'Pending',
    payment: 'Credit Card (ending 8812)',
    shippingAddress: '12 Ocean Drive, Miami, FL 33139',
    trackingNumber: 'Awaiting Payment',
    items: [
      { name: 'Smart Fitness Watch Series 5', price: 199.99, qty: 1, sku: 'WEAR-SW-05' }
    ]
  },
  {
    id: 'ORD-9478',
    customer: { name: 'David Miller', email: 'dmiller@example.com', avatar: 'DM' },
    date: 'Aug 12, 2026 • 11:20 AM',
    total: 129.50,
    status: 'Delivered',
    payment: 'Credit Card (ending 1092)',
    shippingAddress: '88 Tech Blvd, Austin, TX 78701',
    trackingNumber: 'TRK-77291044',
    items: [
      { name: 'USB-C Aluminum Docking Station 11-in-1', price: 129.50, qty: 1, sku: 'DOCK-11-C' }
    ]
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart size={20} className="text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Order Management</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Customer Orders</h1>
          <p className="text-sm text-slate-400 mt-1">Track order status, manage fulfillment, and view transaction details.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f1117] border border-white/5 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Filter size={14} /> Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="All" className="bg-zinc-900">All Statuses</option>
            <option value="Pending" className="bg-zinc-900">Pending</option>
            <option value="Processing" className="bg-zinc-900">Processing</option>
            <option value="Shipped" className="bg-zinc-900">Shipped</option>
            <option value="Delivered" className="bg-zinc-900">Delivered</option>
            <option value="Cancelled" className="bg-zinc-900">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#0f1117] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  let badge = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                  if (order.status === 'Delivered') badge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (order.status === 'Shipped') badge = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                  if (order.status === 'Processing') badge = 'bg-violet-500/10 text-violet-400 border-violet-500/20';
                  if (order.status === 'Pending') badge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  if (order.status === 'Cancelled') badge = 'bg-red-500/10 text-red-400 border-red-500/20';

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-violet-400">{order.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                            {order.customer.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{order.customer.name}</p>
                            <p className="text-[10px] text-slate-500">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{order.date}</td>
                      <td className="py-3.5 px-4 font-bold text-white">${order.total.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${badge}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-violet-600 hover:text-white text-slate-300 font-semibold text-xs transition-all inline-flex items-center gap-1"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl h-full bg-[#0f1117] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto space-y-6 shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 font-mono">{selectedOrder.id}</span>
                  <h2 className="text-xl font-bold text-white">Order Details</h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <p className="text-xs font-semibold text-slate-300">Quick Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedOrder.status === st
                          ? 'bg-violet-600 text-white shadow'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User size={14} className="text-violet-400" /> Customer Information
                </h3>
                <div className="text-xs space-y-1">
                  <p className="text-white font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-slate-400">{selectedOrder.customer.email}</p>
                </div>
              </div>

              {/* Shipping & Payment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-400" /> Delivery Address
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedOrder.shippingAddress}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard size={14} className="text-blue-400" /> Payment & Tracking
                  </h3>
                  <p className="text-xs text-slate-300">{selectedOrder.payment}</p>
                  <p className="text-[11px] text-violet-400 font-mono mt-1">{selectedOrder.trackingNumber}</p>
                </div>
              </div>

              {/* Order Line Items */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Box size={14} className="text-amber-400" /> Line Items
                </h3>
                <div className="divide-y divide-white/5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">SKU: {item.sku} • Qty: {item.qty}</p>
                      </div>
                      <span className="font-bold text-white">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-300">Total Order Amount</span>
                  <span className="text-violet-400">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
