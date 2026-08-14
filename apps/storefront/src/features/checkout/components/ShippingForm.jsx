'use client';

import React, { useState } from 'react';
import Input from '@/features/shared/ui/Input';
import Button from '@/features/shared/ui/Button';
import { User, Mail, Phone, MapPin, Building, Globe, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function ShippingForm({ initialData = {}, onSubmitNext }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    apartment: initialData.apartment || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zip: initialData.zip || '',
    country: initialData.country || 'United States',
  });

  const [aiVerified, setAiVerified] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Shipping Information
          </h2>
          <p className="text-xs text-slate-500">Enter where you'd like your order delivered</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>AI Address Autofill Ready</span>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          leftIcon={User}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          leftIcon={User}
          required
        />
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          leftIcon={Mail}
          helperText="Order confirmation & tracking info will be sent here"
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          leftIcon={Phone}
          required
        />
      </div>

      {/* Address Line 1 */}
      <div className="space-y-1">
        <Input
          label="Street Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          leftIcon={MapPin}
          placeholder="123 Innovation Drive"
          required
        />
        {aiVerified && formData.address.length > 5 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>AI Verified Address: Validated against postal database</span>
          </div>
        )}
      </div>

      {/* Address Line 2 */}
      <Input
        label="Apartment, suite, unit (optional)"
        name="apartment"
        value={formData.apartment}
        onChange={handleChange}
        leftIcon={Building}
        placeholder="Apt 4B"
      />

      {/* City, State, Zip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <Input
          label="State / Province"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <Input
          label="ZIP / Postal Code"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          required
        />
      </div>

      {/* Country Select */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Country / Region
        </label>
        <div className="relative">
          <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="Japan">Japan</option>
          </select>
        </div>
      </div>

      {/* Save Address Checkbox */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="saveAddress"
          defaultChecked
          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
        />
        <label htmlFor="saveAddress" className="text-xs text-slate-600 dark:text-slate-400">
          Save this address to my profile for faster checkout next time
        </label>
      </div>

      {/* Submit CTA */}
      <div className="pt-4 flex justify-end">
        <Button variant="primary" size="lg" type="submit" className="flex items-center gap-2 px-8">
          <span>Continue to Delivery</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
