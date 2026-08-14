'use client';

import React, { useState } from 'react';
import { Bell, ShoppingBag, Tag, Truck, MessageSquare, Mail, Smartphone, Save, CheckCircle } from 'lucide-react';

const NOTIFICATION_GROUPS = [
  {
    id: 'orders',
    title: 'Orders & Shipping',
    icon: Truck,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    items: [
      { id: 'order_placed', label: 'Order Confirmation', description: 'When your order is placed successfully.' },
      { id: 'order_shipped', label: 'Shipment Updates', description: 'When your order ships and tracking updates.' },
      { id: 'order_delivered', label: 'Delivery Confirmation', description: 'When your order is delivered.' },
      { id: 'order_return', label: 'Return & Refund Status', description: 'Updates on your return requests.' },
    ],
  },
  {
    id: 'promotions',
    title: 'Promotions & Offers',
    icon: Tag,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    items: [
      { id: 'flash_sale', label: 'Flash Sales', description: 'Limited-time deals and flash sale alerts.' },
      { id: 'wishlist_sale', label: 'Wishlist Price Drop', description: 'When items in your wishlist go on sale.' },
      { id: 'coupon_expiry', label: 'Coupon Expiry Reminders', description: 'Before your coupons expire.' },
      { id: 'personalized_offers', label: 'Personalized Offers', description: 'Recommendations based on your interests.' },
    ],
  },
  {
    id: 'account',
    title: 'Account Activity',
    icon: Bell,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    items: [
      { id: 'login_alert', label: 'New Device Login', description: 'When your account is accessed from a new device.' },
      { id: 'password_change', label: 'Password Changes', description: 'When your account password is updated.' },
      { id: 'review_request', label: 'Review Requests', description: 'When you can review a recently purchased item.' },
    ],
  },
];

const CHANNELS = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'push', label: 'Push', icon: Smartphone },
  { id: 'sms', label: 'SMS', icon: MessageSquare },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Build initial state: all groups, items, channels
  const buildInitial = () => {
    const state = {};
    NOTIFICATION_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        state[item.id] = { email: true, push: true, sms: false };
      });
    });
    return state;
  };

  const [prefs, setPrefs] = useState(buildInitial);

  const toggle = (itemId, channel) => {
    setPrefs((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [channel]: !prev[itemId][channel] },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Notification Preferences</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize how and when you receive notifications from us.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mr-auto">Channels:</p>
        {CHANNELS.map((ch) => (
          <div key={ch.id} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            <ch.icon size={13} /> {ch.label}
          </div>
        ))}
      </div>

      {/* Groups */}
      <div className="space-y-6">
        {NOTIFICATION_GROUPS.map((group) => (
          <div key={group.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            {/* Group Header */}
            <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${group.bg}`}>
                  <group.icon size={18} className={group.color} />
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">{group.title}</h2>
              </div>
            </div>

            {/* Items */}
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {group.items.map((item) => (
                <li key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0">
                    {CHANNELS.map((ch) => (
                      <div key={ch.id} className="flex flex-col items-center gap-1.5">
                        <span className="text-xs text-gray-400 dark:text-gray-600 hidden sm:block">{ch.label}</span>
                        <Toggle
                          checked={prefs[item.id]?.[ch.id] ?? false}
                          onChange={() => toggle(item.id, ch.id)}
                        />
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-4 sticky bottom-4">
        <div className={`flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}>
          <CheckCircle size={15} /> Preferences saved!
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving...</>
          ) : (
            <><Save size={15} /> Save Preferences</>
          )}
        </button>
      </div>
    </div>
  );
}
