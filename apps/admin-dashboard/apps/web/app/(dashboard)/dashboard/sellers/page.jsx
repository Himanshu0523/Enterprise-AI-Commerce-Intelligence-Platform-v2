'use client';

import { useState } from 'react';
import {
  Store, CheckCircle2, Clock, Ban, Search, ShieldCheck, DollarSign, Star, ArrowUpRight
} from 'lucide-react';

const INITIAL_SELLERS = [
  { id: 'SEL-301', storeName: 'Apex Audio Labs', owner: 'Marcus Vance', gmv: '$148,500.00', products: 42, commission: '12%', rating: 4.9, status: 'Verified' },
  { id: 'SEL-302', storeName: 'Silicon Gear Direct', owner: 'Jessica Wu', gmv: '$290,100.00', products: 118, commission: '10%', rating: 4.8, status: 'Verified' },
  { id: 'SEL-303', storeName: 'Nordic Design Co', owner: 'Lars Olesen', gmv: '$42,000.00', products: 19, commission: '15%', rating: 4.6, status: 'Pending Verification' },
  { id: 'SEL-304', storeName: 'Quantum Peripherals', owner: 'Robert Drake', gmv: '$89,400.00', products: 64, commission: '12%', rating: 4.7, status: 'Verified' },
  { id: 'SEL-305', storeName: 'Vapor Tech Store', owner: 'Unknown Vendor', gmv: '$1,200.00', products: 3, commission: '15%', rating: 2.1, status: 'Suspended' },
];

export default function SellersPage() {
  const [sellers, setSellers] = useState(INITIAL_SELLERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = sellers.filter((s) => {
    const matchesSearch = s.storeName.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status.toUpperCase().replace(/\s+/g, '_') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 size={12} /> Verified Partner</span>;
      case 'Pending Verification':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock size={12} /> Under Review</span>;
      case 'Suspended':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"><Ban size={12} /> Suspended</span>;
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Store className="text-violet-400" /> Marketplace Sellers
          </h1>
          <p className="text-sm text-slate-400">Manage 3rd party vendor onboarding, commission structures, and seller performance.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Verified Partners</span>
            <Store size={16} className="text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {sellers.filter((s) => s.status === 'Verified').length} Vendors
          </p>
          <p className="text-xs text-slate-500">Active marketplace sellers</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Gross Marketplace Volume (GMV)</span>
            <ArrowUpRight size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">$571,200.00</p>
          <p className="text-xs text-emerald-400">+18.3% GMV growth</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Platform Commission Revenue</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">$68,544.00</p>
          <p className="text-xs text-slate-500">Average 12% take-rate</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Applications Pending</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {sellers.filter((s) => s.status === 'Pending Verification').length} Vendors
          </p>
          <p className="text-xs text-slate-500">Requires KYB verification</p>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-[#151821] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by store name or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING_VERIFICATION">Under Review</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f1117] text-slate-400 text-xs font-semibold uppercase border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Store & Vendor</th>
                <th className="py-3.5 px-4">Total Sales (GMV)</th>
                <th className="py-3.5 px-4">Active Listings</th>
                <th className="py-3.5 px-4">Commission Rate</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((seller) => (
                <tr key={seller.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{seller.storeName}</p>
                    <p className="text-xs text-slate-500">{seller.owner} ({seller.id})</p>
                  </td>
                  <td className="py-3.5 px-4 text-white font-bold">{seller.gmv}</td>
                  <td className="py-3.5 px-4 text-slate-400">{seller.products} items</td>
                  <td className="py-3.5 px-4 text-violet-400 font-semibold">{seller.commission}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star size={14} className="fill-amber-400" /> {seller.rating}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(seller.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    {seller.status === 'Pending Verification' && (
                      <button
                        onClick={() => handleUpdateStatus(seller.id, 'Verified')}
                        className="px-3 py-1 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg text-xs font-medium transition"
                      >
                        Approve Vendor
                      </button>
                    )}
                    {seller.status === 'Verified' && (
                      <button
                        onClick={() => handleUpdateStatus(seller.id, 'Suspended')}
                        className="px-3 py-1 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg text-xs font-medium transition"
                      >
                        Suspend
                      </button>
                    )}
                    {seller.status === 'Suspended' && (
                      <button
                        onClick={() => handleUpdateStatus(seller.id, 'Verified')}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
