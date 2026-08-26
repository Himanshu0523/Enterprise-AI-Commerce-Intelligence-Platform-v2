'use client';

import { useState } from 'react';
import {
  Warehouse, Package, AlertTriangle, ArrowUpRight, Search, Filter, Plus, RefreshCw, Layers
} from 'lucide-react';

const INITIAL_INVENTORY = [
  { id: 'INV-101', sku: 'AUDIO-WH-1000XM5', name: 'Sony WH-1000XM5 Wireless Headphones', warehouse: 'US-East (NJ)', quantity: 142, minThreshold: 30, maxCapacity: 500, unitCost: '$280.00', status: 'Optimal' },
  { id: 'INV-102', sku: 'MACBOOK-M3-16-1TB', name: 'MacBook Pro 16" M3 Max', warehouse: 'US-West (CA)', quantity: 18, minThreshold: 25, maxCapacity: 100, unitCost: '$3,100.00', status: 'Low Stock' },
  { id: 'INV-103', sku: 'APPL-WATCH-ULTRA2', name: 'Apple Watch Ultra 2 GPS + Cellular', warehouse: 'EU-Central (DE)', quantity: 0, minThreshold: 15, maxCapacity: 200, unitCost: '$650.00', status: 'Out of Stock' },
  { id: 'INV-104', sku: 'SAMSUNG-S24-ULTRA', name: 'Samsung Galaxy S24 Ultra 512GB', warehouse: 'US-East (NJ)', quantity: 85, minThreshold: 40, maxCapacity: 300, unitCost: '$920.00', status: 'Optimal' },
  { id: 'INV-105', sku: 'DELL-XPS-15-9530', name: 'Dell XPS 15 OLED Touch Laptop', warehouse: 'APAC-SG (SG)', quantity: 12, minThreshold: 20, maxCapacity: 150, unitCost: '$1,850.00', status: 'Low Stock' },
  { id: 'INV-106', sku: 'LOGI-MX-MASTER-3S', name: 'Logitech MX Master 3S Mouse', warehouse: 'US-West (CA)', quantity: 310, minThreshold: 50, maxCapacity: 600, unitCost: '$75.00', status: 'Optimal' },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');

  const filtered = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'ALL' || item.warehouse.includes(warehouseFilter);
    const matchesStatus = statusFilter === 'ALL' || item.status.toUpperCase().replace(/\s+/g, '_') === statusFilter;
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem || !adjustQty) return;
    const added = parseInt(adjustQty, 10);
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.id === selectedItem.id) {
          const newQty = Math.max(0, inv.quantity + added);
          let newStatus = 'Optimal';
          if (newQty === 0) newStatus = 'Out of Stock';
          else if (newQty <= inv.minThreshold) newStatus = 'Low Stock';
          return { ...inv, quantity: newQty, status: newStatus };
        }
        return inv;
      })
    );
    setShowAdjustModal(false);
    setSelectedItem(null);
    setAdjustQty('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Optimal':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Optimal</span>;
      case 'Low Stock':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Low Stock</span>;
      case 'Out of Stock':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Out of Stock</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Warehouse className="text-violet-400" /> Inventory & Warehousing
          </h1>
          <p className="text-sm text-slate-400">Track stock counts, reorder thresholds, and warehouse allocations in real-time.</p>
        </div>
        <button
          onClick={() => { setSelectedItem(inventory[0]); setShowAdjustModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-violet-600/25"
        >
          <Plus size={16} /> Quick Stock Adjustment
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Total Catalog SKU Count</span>
            <Package size={16} className="text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white">{inventory.length}</p>
          <p className="text-xs text-slate-500">Across 4 global hubs</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Stock Valuation</span>
            <ArrowUpRight size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">$482,900.00</p>
          <p className="text-xs text-emerald-400">+4.2% vs last month</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Low Stock Alerts</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {inventory.filter((i) => i.status === 'Low Stock').length} Items
          </p>
          <p className="text-xs text-slate-500">Below minimum safety threshold</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Stockouts</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">
            {inventory.filter((i) => i.status === 'Out of Stock').length} Items
          </p>
          <p className="text-xs text-slate-500">Action required immediately</p>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-[#151821] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU or item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">All Warehouses</option>
              <option value="US-East">US-East (NJ)</option>
              <option value="US-West">US-West (CA)</option>
              <option value="EU-Central">EU-Central (DE)</option>
              <option value="APAC-SG">APAC-SG (SG)</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPTIMAL">Optimal</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f1117] text-slate-400 text-xs font-semibold uppercase border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-4">Warehouse</th>
                <th className="py-3.5 px-4">Available Qty</th>
                <th className="py-3.5 px-4">Safety Limit</th>
                <th className="py-3.5 px-4">Unit Cost</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.sku}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.warehouse}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{item.quantity} units</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.minThreshold} units</td>
                  <td className="py-3.5 px-4 text-white font-medium">{item.unitCost}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => { setSelectedItem(item); setShowAdjustModal(true); }}
                      className="px-3 py-1.5 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white rounded-lg text-xs font-medium transition"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No inventory records matching current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#151821] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="text-violet-400" size={18} /> Adjust Inventory Stock
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{selectedItem.name}</p>
              <p className="text-xs text-slate-400">SKU: {selectedItem.sku} | Hub: {selectedItem.warehouse}</p>
              <p className="text-xs text-slate-400 mt-1">Current Stock: <span className="text-white font-bold">{selectedItem.quantity} units</span></p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Adjustment Quantity (+ to add, - to subtract)</label>
                <input
                  type="number"
                  placeholder="e.g. +50 or -10"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition"
                >
                  Save Stock Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
