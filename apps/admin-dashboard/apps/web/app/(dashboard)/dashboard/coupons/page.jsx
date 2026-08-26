'use client';

import { useState } from 'react';
import {
  Tag, Plus, Percent, DollarSign, Calendar, Zap, Search, Copy, CheckCircle2, Clock, Ban
} from 'lucide-react';

const INITIAL_COUPONS = [
  { id: 'COP-101', code: 'SUMMER20', type: 'Percentage', value: '20%', minSpend: '$100.00', uses: '450 / 1000', expires: '2026-08-31', status: 'Active' },
  { id: 'COP-102', code: 'WELCOME50', type: 'Fixed Amount', value: '$50.00', minSpend: '$250.00', uses: '182 / 500', expires: '2026-12-31', status: 'Active' },
  { id: 'COP-103', code: 'VIPAI99', type: 'Percentage', value: '30%', minSpend: '$500.00', uses: '50 / 50', expires: '2026-08-01', status: 'Expired' },
  { id: 'COP-104', code: 'FLASHDEAL15', type: 'Percentage', value: '15%', minSpend: '$50.00', uses: '0 / 2000', expires: '2026-09-15', status: 'Scheduled' },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'Percentage',
    value: '',
    minSpend: '0',
    limit: '100',
    expires: '',
  });

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    const created = {
      id: `COP-${Date.now().toString().slice(-3)}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: newCoupon.type === 'Percentage' ? `${newCoupon.value}%` : `$${newCoupon.value}`,
      minSpend: `$${newCoupon.minSpend}.00`,
      uses: `0 / ${newCoupon.limit}`,
      expires: newCoupon.expires || '2026-12-31',
      status: 'Active',
    };
    setCoupons([created, ...coupons]);
    setShowModal(false);
    setNewCoupon({ code: '', type: 'Percentage', value: '', minSpend: '0', limit: '100', expires: '' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 size={12} /> Active</span>;
      case 'Scheduled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Clock size={12} /> Scheduled</span>;
      case 'Expired':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20"><Ban size={12} /> Expired</span>;
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
            <Tag className="text-violet-400" /> Coupons & Promotions
          </h1>
          <p className="text-sm text-slate-400">Create promo codes, set minimum purchase rules, and track campaign usage.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-violet-600/25"
        >
          <Plus size={16} /> Create Coupon Code
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Active Campaigns</span>
            <Tag size={16} className="text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {coupons.filter((c) => c.status === 'Active').length} Promos
          </p>
          <p className="text-xs text-slate-500">Live across storefront</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Total Redemptions</span>
            <Zap size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">682 Uses</p>
          <p className="text-xs text-slate-500">This calendar month</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Discounts Granted</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">$18,450.00</p>
          <p className="text-xs text-emerald-400">+14% revenue lift</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Avg Order Value Lift</span>
            <Percent size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">+28.5%</p>
          <p className="text-xs text-slate-500">When coupons are applied</p>
        </div>
      </div>

      {/* Coupon List Table */}
      <div className="bg-[#151821] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search coupon code or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f1117] text-slate-400 text-xs font-semibold uppercase border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Promo Code</th>
                <th className="py-3.5 px-4">Discount Type</th>
                <th className="py-3.5 px-4">Discount Value</th>
                <th className="py-3.5 px-4">Min Order Spend</th>
                <th className="py-3.5 px-4">Redemption Count</th>
                <th className="py-3.5 px-4">Expiration Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{coupon.type}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{coupon.value}</td>
                  <td className="py-3.5 px-4 text-slate-400">{coupon.minSpend}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{coupon.uses}</td>
                  <td className="py-3.5 px-4 text-slate-400">{coupon.expires}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(coupon.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#151821] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="text-violet-400" size={18} /> Create Promotional Coupon
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. AUTUMN25"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500 uppercase font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Discount Type</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Value ({newCoupon.type === 'Percentage' ? '%' : '$'})</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newCoupon.minSpend}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={newCoupon.expires}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expires: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
