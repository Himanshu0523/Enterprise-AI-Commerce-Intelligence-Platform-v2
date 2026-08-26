'use client';

import { useState, useEffect } from 'react';
import {
  Package, Plus, Search, Filter, Edit, Trash2, CheckCircle2,
  AlertTriangle, RefreshCw, X, Image as ImageIcon, DollarSign, Tag, Layers
} from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 'PROD-101', name: 'Wireless Noise-Canceling Headphones', sku: 'AUDIO-NC-01', category: 'Electronics', price: 299.99, stock: 45, status: 'In Stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150' },
  { id: 'PROD-102', name: 'Ultra-Wide Curved Gaming Monitor 34"', sku: 'DISP-UW-34', category: 'Electronics', price: 649.50, stock: 8, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150' },
  { id: 'PROD-103', name: 'Ergonomic RGB Mechanical Keyboard', sku: 'PERI-KB-88', category: 'Accessories', price: 159.00, stock: 12, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150' },
  { id: 'PROD-104', name: 'Smart Fitness Watch Series 5', sku: 'WEAR-SW-05', category: 'Wearables', price: 199.99, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150' },
  { id: 'PROD-105', name: 'USB-C Aluminum Docking Station 11-in-1', sku: 'DOCK-11-C', category: 'Accessories', price: 129.50, stock: 78, status: 'In Stock', image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=150' },
  { id: 'PROD-106', name: 'Premium Leather Executive Desk Mat', sku: 'DESK-LTH-L', category: 'Office Supplies', price: 49.99, stock: 110, status: 'In Stock', image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=150' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      // Use fallback products if API gateway is offline
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    const stockNum = parseInt(formData.stock) || 0;
    const status = stockNum === 0 ? 'Out of Stock' : stockNum < 15 ? 'Low Stock' : 'In Stock';

    if (editingProduct) {
      // Edit existing
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData, price: parseFloat(formData.price), stock: stockNum, status } : p));
      setEditingProduct(null);
    } else {
      // Create new
      const newProd = {
        id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: stockNum,
        status,
        image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150',
      };
      setProducts(prev => [newProd, ...prev]);
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      image: product.image || '',
    });
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', sku: '', category: 'Electronics', price: '', stock: '', description: '', image: '' });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package size={20} className="text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Inventory Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Product Management</h1>
          <p className="text-sm text-slate-400 mt-1">Manage SKUs, pricing, stock allocation, and product listings.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Sync API
          </button>
          <button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 transition-all"
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f1117] border border-white/5 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Filter size={14} /> Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="All" className="bg-zinc-900">All Categories</option>
            <option value="Electronics" className="bg-zinc-900">Electronics</option>
            <option value="Accessories" className="bg-zinc-900">Accessories</option>
            <option value="Wearables" className="bg-zinc-900">Wearables</option>
            <option value="Office Supplies" className="bg-zinc-900">Office Supplies</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#0f1117] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  let badge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (p.status === 'Low Stock') badge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  if (p.status === 'Out of Stock') badge = 'bg-red-500/10 text-red-400 border-red-500/20';

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-white/5 border border-white/10 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{p.sku}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">${typeof p.price === 'number' ? p.price.toFixed(2) : p.price}</td>
                      <td className="py-3.5 px-4 font-semibold">{p.stock} units</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${badge}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-violet-600/20 hover:text-violet-400 text-slate-400 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-slate-400 transition-colors"
                        >
                          <Trash2 size={14} />
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

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1117] border border-white/10 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Ergonomic Headphones"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AUD-NC-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Electronics" className="bg-zinc-900">Electronics</option>
                    <option value="Accessories" className="bg-zinc-900">Accessories</option>
                    <option value="Wearables" className="bg-zinc-900">Wearables</option>
                    <option value="Office Supplies" className="bg-zinc-900">Office Supplies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="299.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
