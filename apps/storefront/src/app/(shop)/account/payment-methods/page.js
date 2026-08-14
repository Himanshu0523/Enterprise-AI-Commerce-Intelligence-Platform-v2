'use client';

import { useState } from 'react';
import { CreditCard, Plus, Trash2, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState([
    {
      id: 'card_1',
      type: 'Visa',
      last4: '4242',
      expiry: '12/28',
      holder: 'Aura Customer',
      isDefault: true,
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    },
    {
      id: 'card_2',
      type: 'Mastercard',
      last4: '8899',
      expiry: '09/27',
      holder: 'Aura Customer',
      isDefault: false,
      bgGradient: 'from-zinc-900 via-zinc-800 to-stone-900',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });

  const handleDelete = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleSetDefault = (id) => {
    setCards(cards.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.number || !newCard.holder || !newCard.expiry) return;

    const added = {
      id: 'card_' + Date.now(),
      type: newCard.number.startsWith('4') ? 'Visa' : 'Mastercard',
      last4: newCard.number.slice(-4) || '1234',
      expiry: newCard.expiry,
      holder: newCard.holder,
      isDefault: cards.length === 0,
      bgGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    };

    setCards([...cards, added]);
    setNewCard({ number: '', holder: '', expiry: '', cvv: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Methods</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Manage your saved credit cards and secure express payment options.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" /> Add Payment Method
        </button>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-slate-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-200">No payment methods saved</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Save a payment method to speed up your checkout process next time you shop.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgGradient} p-6 text-white shadow-xl border border-white/10 flex flex-col justify-between h-52`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-widest text-lg italic text-white/90">{card.type}</span>
                {card.isDefault ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-full backdrop-blur-md">
                    <CheckCircle2 className="h-3 w-3" /> Default
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    className="text-[11px] font-medium text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition backdrop-blur-md"
                  >
                    Set as Default
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-white/60 tracking-wider">CARD NUMBER</p>
                <p className="text-xl font-mono tracking-widest">•••• •••• •••• {card.last4}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">Card Holder</p>
                  <p className="text-sm font-semibold tracking-wide uppercase">{card.holder}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">Expires</p>
                  <p className="text-sm font-semibold tracking-wide">{card.expiry}</p>
                </div>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition"
                  title="Remove Card"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
        <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0" />
        <span>Your payment information is encrypted with 256-bit SSL technology. We never store raw card numbers.</span>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-500" /> Add New Card
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={newCard.holder}
                  onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  placeholder="4532 0000 0000 0000"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="•••"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

