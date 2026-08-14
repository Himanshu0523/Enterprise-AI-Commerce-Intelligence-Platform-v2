'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/lib/contexts/CheckoutContext';

const shippingMethods = [
  { id: 'standard', label: 'Standard Shipping', price: 5.99, days: '5-7 days' },
  { id: 'express', label: 'Express Shipping', price: 12.99, days: '2-3 days' },
  { id: 'overnight', label: 'Overnight Shipping', price: 24.99, days: '1 day' },
];

/**
 * Shipping Page Component
 */
export default function ShippingPage() {
  const { state, setShippingAddress, setShippingMethod } = useCheckout();
  const router = useRouter();

  const [address, setAddress] = useState(
    state.shippingAddress || {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
      phone: '',
    }
  );
  const [selectedMethod, setSelectedMethod] = useState(
    state.shippingMethod || ''
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!address.firstName) newErrors.firstName = 'First name required';
    if (!address.lastName) newErrors.lastName = 'Last name required';
    if (!address.address) newErrors.address = 'Address required';
    if (!address.city) newErrors.city = 'City required';
    if (!address.state) newErrors.state = 'State required';
    if (!address.zip) newErrors.zip = 'ZIP code required';
    if (!address.country) newErrors.country = 'Country required';
    if (!address.phone) newErrors.phone = 'Phone number required';
    if (!selectedMethod) newErrors.method = 'Please select a shipping method';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setShippingAddress(address);
    setShippingMethod(selectedMethod);
    router.push('/checkout/payment');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            value={address.firstName}
            onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={address.lastName}
            onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Street Address</label>
          <input
            type="text"
            value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">State</label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">ZIP Code</label>
          <input
            type="text"
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Country</label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>

      {/* Shipping methods */}
      <div>
        <h3 className="text-lg font-semibold">Shipping Method</h3>
        <div className="mt-4 space-y-2">
          {shippingMethods.map((method) => (
            <label key={method.id} className="flex items-center gap-3 rounded border p-3 cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className="h-4 w-4 text-indigo-600"
              />
              <span className="flex-1">
                <span className="font-medium">{method.label}</span>
                <span className="ml-2 text-sm text-gray-600">({method.days})</span>
              </span>
              <span className="font-semibold">${method.price.toFixed(2)}</span>
            </label>
          ))}
          {errors.method && <p className="text-sm text-red-600">{errors.method}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.push('/checkout')}
          className="rounded border border-gray-300 px-6 py-2 hover:bg-gray-50"
        >
          Back to Cart
        </button>
        <button
          type="submit"
          className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 font-medium"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}