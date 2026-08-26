'use client';

import { useState } from 'react';
import {
  Truck, PackageCheck, AlertTriangle, Clock, Search, MapPin, ExternalLink, ArrowRight, ShieldCheck
} from 'lucide-react';

const INITIAL_SHIPMENTS = [
  { id: 'SHP-901', orderId: 'ORD-9421', carrier: 'FedEx Express', tracking: 'FX-8492049182', destination: 'New York, NY (US)', items: 2, weight: '3.4 kg', status: 'In Transit', eta: '2026-08-15' },
  { id: 'SHP-902', orderId: 'ORD-9420', carrier: 'UPS Next Day', tracking: '1Z99999999999999', destination: 'San Francisco, CA (US)', items: 1, weight: '1.2 kg', status: 'Out for Delivery', eta: '2026-08-14' },
  { id: 'SHP-903', orderId: 'ORD-9419', carrier: 'DHL Express', tracking: 'DHL-3920194812', destination: 'Berlin, Germany (DE)', items: 4, weight: '8.1 kg', status: 'In Transit', eta: '2026-08-17' },
  { id: 'SHP-904', orderId: 'ORD-9418', carrier: 'USPS Priority', tracking: '9400100000000000', destination: 'Chicago, IL (US)', items: 1, weight: '0.5 kg', status: 'Delivered', eta: '2026-08-13' },
  { id: 'SHP-905', orderId: 'ORD-9417', carrier: 'FedEx Ground', tracking: 'FX-7738201941', destination: 'Austin, TX (US)', items: 3, weight: '5.2 kg', status: 'Exception', eta: '2026-08-16' },
];

export default function ShippingPage() {
  const [shipments] = useState(INITIAL_SHIPMENTS);
  const [search, setSearch] = useState('');
  const [carrierFilter, setCarrierFilter] = useState('ALL');

  const filtered = shipments.filter((shp) => {
    const matchesSearch = shp.tracking.toLowerCase().includes(search.toLowerCase()) || shp.orderId.toLowerCase().includes(search.toLowerCase()) || shp.destination.toLowerCase().includes(search.toLowerCase());
    const matchesCarrier = carrierFilter === 'ALL' || shp.carrier.includes(carrierFilter);
    return matchesSearch && matchesCarrier;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><PackageCheck size={12} /> Delivered</span>;
      case 'Out for Delivery':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Truck size={12} /> Out for Delivery</span>;
      case 'In Transit':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20"><Clock size={12} /> In Transit</span>;
      case 'Exception':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"><AlertTriangle size={12} /> Delay Exception</span>;
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
            <Truck className="text-violet-400" /> Shipping & Fulfillment
          </h1>
          <p className="text-sm text-slate-400">Track real-time carrier dispatching, delivery exceptions, and order fulfillment status.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>In-Transit Shipments</span>
            <Truck size={16} className="text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-white">418 Orders</p>
          <p className="text-xs text-slate-500">En route via active carriers</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>On-Time Delivery Rate</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">99.2%</p>
          <p className="text-xs text-emerald-400">+0.4% SLA adherence</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Avg Fulfillment Time</span>
            <Clock size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">4.2 Hours</p>
          <p className="text-xs text-slate-500">From checkout to carrier pickup</p>
        </div>
        <div className="bg-[#151821] p-5 rounded-2xl border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Delivery Exceptions</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">3 Packages</p>
          <p className="text-xs text-slate-500">Weather delay / address issues</p>
        </div>
      </div>

      {/* Shipment Table */}
      <div className="bg-[#151821] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tracking #, order ID, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="px-3 py-2 bg-[#0f1117] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500"
          >
            <option value="ALL">All Carriers</option>
            <option value="FedEx">FedEx</option>
            <option value="UPS">UPS</option>
            <option value="DHL">DHL</option>
            <option value="USPS">USPS</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0f1117] text-slate-400 text-xs font-semibold uppercase border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Tracking Code & Order</th>
                <th className="py-3.5 px-4">Carrier</th>
                <th className="py-3.5 px-4">Destination Hub</th>
                <th className="py-3.5 px-4">Parcel Specs</th>
                <th className="py-3.5 px-4">Estimated Delivery</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((shp) => (
                <tr key={shp.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-semibold text-white">{shp.tracking}</p>
                    <p className="text-xs text-slate-500">{shp.orderId}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{shp.carrier}</td>
                  <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1.5 pt-4">
                    <MapPin size={14} className="text-violet-400 flex-shrink-0" /> {shp.destination}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{shp.items} items ({shp.weight})</td>
                  <td className="py-3.5 px-4 text-white font-medium">{shp.eta}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(shp.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
