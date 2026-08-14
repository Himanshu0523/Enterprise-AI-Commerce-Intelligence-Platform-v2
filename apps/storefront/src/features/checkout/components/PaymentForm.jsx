'use client';

import React, { useState } from 'react';
import Input from '@/features/shared/ui/Input';
import Button from '@/features/shared/ui/Button';
import { CreditCard, ShieldCheck, Lock, ArrowLeft, ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';

const METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'paypal', label: 'PayPal Instant', icon: DollarSign },
  { id: 'apple', label: 'Apple Pay / Google Pay', icon: Lock },
  { id: 'cod', label: 'Cash on Delivery', icon: ShieldCheck },
];

export default function PaymentForm({ onBack, onSubmitNext, initialMethod = 'card' }) {
  const [method, setMethod] = useState(initialMethod);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitNext({ method, cardDetails });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Payment Method
        </h2>
        <p className="text-xs text-slate-500">All transactions are 256-bit encrypted & secure</p>
      </div>

      {/* Payment Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {METHODS.map((m) => {
          const Icon = m.icon;
          const isSelected = method === m.id;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Credit Card Form Panel */}
      {method === 'card' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Card Details
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">VISA</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">MC</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">AMEX</span>
            </div>
          </div>

          <Input
            label="Cardholder Name"
            name="name"
            placeholder="Johnathan Doe"
            value={cardDetails.name}
            onChange={handleCardChange}
            required
          />

          <Input
            label="Card Number"
            name="number"
            placeholder="4532 •••• •••• 8892"
            value={cardDetails.number}
            onChange={handleCardChange}
            leftIcon={CreditCard}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              name="expiry"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={handleCardChange}
              required
            />
            <Input
              label="Security Code (CVV)"
              name="cvv"
              type="password"
              maxLength={4}
              placeholder="123"
              value={cardDetails.cvv}
              onChange={handleCardChange}
              required
            />
          </div>
        </div>
      )}

      {/* Alternative Payment Messages */}
      {method === 'paypal' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <DollarSign className="w-8 h-8 text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Pay securely with PayPal
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You will be redirected to PayPal's secure login screen to complete your payment upon clicking place order.
          </p>
        </div>
      )}

      {method === 'apple' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Lock className="w-8 h-8 text-slate-900 dark:text-slate-100 mx-auto" />
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Express 1-Touch Checkout
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use your biometric Touch ID / Face ID or Google Wallet saved cards for instantaneous verification.
          </p>
        </div>
      )}

      {method === 'cod' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Pay Cash Upon Doorstep Delivery
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Pay exact cash or scan courier QR code on arrival. No prior payment required.
          </p>
        </div>
      )}

      {/* Security Guarantee Note */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs">
        <Lock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
        <span>Your payment information is encrypted using bank-grade AES-256 protocols.</span>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button variant="ghost" size="md" type="button" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Delivery
        </Button>
        <Button variant="primary" size="lg" type="submit" className="flex items-center gap-2 px-8">
          <span>Review Order</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
