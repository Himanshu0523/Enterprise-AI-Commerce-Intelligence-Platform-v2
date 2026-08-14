'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Building, Home, MapPinned, X } from 'lucide-react';

const mockAddresses = [
  {
    id: 'addr1',
    type: 'Home',
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'US',
    phone: '+1-555-1234',
    isDefault: true,
  },
  {
    id: 'addr2',
    type: 'Work',
    firstName: 'John',
    lastName: 'Doe',
    address: '456 Tech Park, Building C',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    country: 'US',
    phone: '+1-555-5678',
    isDefault: false,
  },
];

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    setAddresses((prev) => [
      ...prev,
      {
        ...newAddress,
        id: `addr_${Date.now()}`,
        isDefault: prev.length === 0,
      },
    ]);
    setIsAddModalOpen(false);
    setNewAddress({ type: 'Home', firstName: '', lastName: '', address: '', city: '', state: '', zip: '', country: 'US', phone: '' });
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Work':
        return <Building size={18} className="text-blue-500" />;
      case 'Home':
        return <Home size={18} className="text-emerald-500" />;
      default:
        return <MapPinned size={18} className="text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Addresses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your shipping and billing addresses.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="group flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 dark:shadow-none"
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90" /> 
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No saved addresses</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Add an address for quicker checkout experiences.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:shadow-md ${
                addr.isDefault
                  ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-500/30 dark:bg-indigo-500/5'
                  : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
              }`}
            >
              {addr.isDefault && (
                <span className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  <CheckCircle2 size={12} /> Default
                </span>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    {getAddressIcon(addr.type)}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{addr.type}</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white">
                  {addr.firstName} {addr.lastName}
                </p>
                <p>{addr.address}</p>
                <p>{addr.city}, {addr.state} {addr.zip}</p>
                <p>{addr.country}</p>
                <p className="pt-2">Phone: {addr.phone}</p>
              </div>

              {!addr.isDefault && (
                <button 
                  onClick={() => handleSetDefault(addr.id)}
                  className="mt-6 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Address</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAddress} className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    required
                    type="text"
                    value={newAddress.firstName}
                    onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <input
                    required
                    type="text"
                    value={newAddress.lastName}
                    onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address Line</label>
                <input
                  required
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                  <input
                    required
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State / Province</label>
                  <input
                    required
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ZIP / Postal Code</label>
                  <input
                    required
                    type="text"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input
                    required
                    type="text"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address Label</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Home', 'Work', 'Other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddress({...newAddress, type})}
                      className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors ${
                        newAddress.type === type 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300' 
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {getAddressIcon(type)}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}