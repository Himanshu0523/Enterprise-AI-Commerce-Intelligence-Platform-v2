'use client';

import { useState, useEffect } from 'react';
import {
  Users, Search, Filter, Mail, Shield, Award,
  CheckCircle2, RefreshCw, Eye, UserCheck, DollarSign, ShoppingBag
} from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: 'CUST-1001', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Customer', ordersCount: 14, totalSpent: 2840.50, status: 'VIP', joined: 'Jan 12, 2025', avatar: 'SJ' },
  { id: 'CUST-1002', name: 'Alex Rivera', email: 'arivera@example.com', role: 'Customer', ordersCount: 8, totalSpent: 1250.00, status: 'Active', joined: 'Mar 04, 2025', avatar: 'AR' },
  { id: 'CUST-1003', name: 'Michael Chen', email: 'mchen88@example.com', role: 'Customer', ordersCount: 5, totalSpent: 790.00, status: 'Active', joined: 'May 19, 2025', avatar: 'MC' },
  { id: 'CUST-1004', name: 'Emma Watson', email: 'emma.w@example.com', role: 'Customer', ordersCount: 2, totalSpent: 340.00, status: 'Active', joined: 'Jul 22, 2025', avatar: 'EW' },
  { id: 'CUST-1005', name: 'David Miller', email: 'dmiller@example.com', role: 'Admin', ordersCount: 24, totalSpent: 4890.00, status: 'VIP', joined: 'Nov 01, 2024', avatar: 'DM' },
  { id: 'CUST-1006', name: 'Jessica Taylor', email: 'jtaylor@example.com', role: 'Seller', ordersCount: 0, totalSpent: 0.00, status: 'Inactive', joined: 'Aug 02, 2026', avatar: 'JT' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        }
      }
    } catch (err) {
      // Keep mock customers
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={20} className="text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">User Management</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Customer Directory</h1>
          <p className="text-sm text-slate-400 mt-1">Manage registered accounts, view purchasing history, and user roles.</p>
        </div>

        <button
          onClick={fetchCustomers}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all w-fit"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Users API
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f1117] border border-white/5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Customers</p>
            <p className="text-2xl font-bold text-white">3,890</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1117] border border-white/5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-600/20 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400">VIP Members</p>
            <p className="text-2xl font-bold text-white">412</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1117] border border-white/5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Avg Customer LTV</p>
            <p className="text-2xl font-bold text-white">$420.50</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f1117] border border-white/5 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Filter size={14} /> Filter Role:
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="All" className="bg-zinc-900">All Roles</option>
            <option value="Customer" className="bg-zinc-900">Customer</option>
            <option value="Admin" className="bg-zinc-900">Admin</option>
            <option value="Seller" className="bg-zinc-900">Seller</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0f1117] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map((c) => {
                let badge = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                if (c.status === 'VIP') badge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (c.status === 'Active') badge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                return (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center font-bold text-xs text-violet-300">
                          {c.avatar || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300">
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{c.ordersCount} orders</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">${c.totalSpent.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${badge}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{c.joined}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
