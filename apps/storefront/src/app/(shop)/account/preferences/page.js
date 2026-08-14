'use client';

import React, { useState } from 'react';
import { Globe, Moon, Palette, ShoppingBag, CreditCard, Scale, Save, CheckCircle, ChevronDown } from 'lucide-react';

const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'JPY (¥)', 'CAD ($)', 'AUD ($)'];
const LANGUAGES = ['English (US)', 'English (UK)', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese'];
const UNITS = ['Metric (kg, cm)', 'Imperial (lb, in)'];
const SIZE_SYSTEMS = ['US', 'UK', 'EU', 'Asian'];
const THEMES = [
  { id: 'system', label: 'System', description: 'Match your device setting' },
  { id: 'light', label: 'Light', description: 'Always use light mode' },
  { id: 'dark', label: 'Dark', description: 'Always use dark mode' },
];

function SelectField({ label, value, onChange, options, icon: Icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {Icon && <Icon size={13} className="inline mr-1.5 text-gray-400" />}{label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default function PreferencesPage() {
  const [currency, setCurrency] = useState('USD ($)');
  const [language, setLanguage] = useState('English (US)');
  const [units, setUnits] = useState('Metric (kg, cm)');
  const [sizeSystem, setSizeSystem] = useState('US');
  const [theme, setTheme] = useState('system');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toggles, setToggles] = useState({
    cookiesAnalytics: true,
    personalizedAds: false,
    recentlyViewed: true,
    reduceMotion: false,
    highContrast: false,
  });

  const setToggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Preferences</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Customize your shopping experience, display, and privacy settings.</p>
      </div>

      {/* Regional */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10"><Globe size={18} className="text-blue-500" /></div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Regional & Language</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField label="Language" value={language} onChange={setLanguage} options={LANGUAGES} icon={Globe} />
          <SelectField label="Currency" value={currency} onChange={setCurrency} options={CURRENCIES} icon={CreditCard} />
          <SelectField label="Measurement Units" value={units} onChange={setUnits} options={UNITS} icon={Scale} />
          <SelectField label="Size System" value={sizeSystem} onChange={setSizeSystem} options={SIZE_SYSTEMS} icon={ShoppingBag} />
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10"><Palette size={18} className="text-indigo-500" /></div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>
        <div className="p-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-1.5"><Moon size={13} /> Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <label
                key={t.id}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                  theme === t.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input type="radio" name="theme" value={t.id} checked={theme === t.id} onChange={() => setTheme(t.id)} className="sr-only" />
                <div className={`h-10 w-10 rounded-xl ${t.id === 'dark' ? 'bg-gray-800' : t.id === 'light' ? 'bg-gray-100 border border-gray-200' : 'bg-gradient-to-br from-gray-100 to-gray-800'}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.description}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
            <Toggle label="Reduce Motion" description="Disable animations for accessibility." checked={toggles.reduceMotion} onChange={() => setToggle('reduceMotion')} />
            <Toggle label="High Contrast" description="Improve readability with higher contrast." checked={toggles.highContrast} onChange={() => setToggle('highContrast')} />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 px-6 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10"><ShoppingBag size={18} className="text-amber-500" /></div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Shopping & Privacy</h2>
        </div>
        <div className="px-6 divide-y divide-gray-100 dark:divide-gray-800">
          <Toggle label="Analytics Cookies" description="Help us improve the site by sharing anonymous usage data." checked={toggles.cookiesAnalytics} onChange={() => setToggle('cookiesAnalytics')} />
          <Toggle label="Personalized Ads" description="See ads based on your browsing and purchase history." checked={toggles.personalizedAds} onChange={() => setToggle('personalizedAds')} />
          <Toggle label="Recently Viewed History" description="Keep track of products you've recently viewed." checked={toggles.recentlyViewed} onChange={() => setToggle('recentlyViewed')} />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle size={14} /> Preferences saved!
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Saving...</> : <><Save size={15} />Save Preferences</>}
        </button>
      </div>
    </div>
  );
}
