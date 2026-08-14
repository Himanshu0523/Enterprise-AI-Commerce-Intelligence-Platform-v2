'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboard({ user }) {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace with real API call later
    const fetchStats = async () => {
      const data = { totalProducts: 0, activeOrders: 0, monthlyRevenue: 0 };
      setStats(data);
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500 text-sm">Active Orders</p>
          <p className="text-3xl font-bold">{stats.activeOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="text-gray-500 text-sm">Monthly Revenue</p>
          <p className="text-3xl font-bold">${stats.monthlyRevenue}</p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Store</h2>
        <button
          onClick={() => router.push('/seller/products')}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Manage Products
        </button>
      </div>
    </div>
  );
}