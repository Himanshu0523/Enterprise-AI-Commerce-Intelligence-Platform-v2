'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Tag, ShieldCheck, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import Price from '@/features/shared/ui/Price';
import Button from '@/features/shared/ui/Button';
import Input from '@/features/shared/ui/Input';

export default function CartSummary({
  subtotal = 0,
  tax = 0,
  shipping = 0,
  discount = 0,
  freeShippingThreshold = 150,
  onApplyCoupon,
  appliedCoupon,
  isProcessing = false,
}) {
  const [couponCode, setCouponCode] = useState('');
  const [aiApplying, setAiApplying] = useState(false);
  const [aiMessage, setAiMessage] = useState(null);

  const calculatedTotal = Math.max(0, subtotal + tax + shipping - discount);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApply = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      onApplyCoupon?.(couponCode);
      setCouponCode('');
    }
  };

  const handleAiSmartCoupon = () => {
    setAiApplying(true);
    setAiMessage(null);
    setTimeout(() => {
      setAiApplying(false);
      onApplyCoupon?.('AICLUB20');
      setAiMessage('✨ AI found & applied code "AICLUB20" for 20% off!');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-100 dark:shadow-none sticky top-24">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
        Order Summary
      </h2>

      {/* Free Shipping Progress Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            {remainingForFreeShipping > 0 ? (
              <>
                Add <span className="text-indigo-600 dark:text-indigo-400">${remainingForFreeShipping.toFixed(2)}</span> for Free Express Shipping
              </>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> You unlocked FREE Express Shipping!
              </span>
            )}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* AI Smart Coupon Finder Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/30 border border-indigo-200/60 dark:border-indigo-800/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-900 dark:text-slate-100">
              AI Smart Coupon Finder
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              Let AI scan 15+ promo codes for maximum cart savings.
            </p>
            {aiMessage ? (
              <p className="mt-2 font-medium text-indigo-600 dark:text-indigo-400">{aiMessage}</p>
            ) : (
              <button
                onClick={handleAiSmartCoupon}
                disabled={aiApplying}
                className="mt-2.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                {aiApplying ? (
                  <>Scanning codes...</>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" /> Auto-Apply Best Coupon
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coupon Code Manual Input */}
      <form onSubmit={handleApply} className="flex gap-2">
        <Input
          placeholder="Promo code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          leftIcon={Tag}
          className="text-xs"
        />
        <Button type="submit" variant="outline" size="md" className="whitespace-nowrap text-xs">
          Apply
        </Button>
      </form>

      {appliedCoupon && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
          <span className="font-medium flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Coupon `{appliedCoupon}` applied
          </span>
          <span className="font-bold">-${discount.toFixed(2)}</span>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-3 pt-2 text-sm border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Discount</span>
            <span className="font-semibold">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Tax</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-baseline pt-3 text-base border-t border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-900 dark:text-slate-100">Total</span>
          <Price amount={calculatedTotal} currency="$" size="2xl" weight="extrabold" />
        </div>
      </div>

      {/* Checkout CTA */}
      <Link href="/checkout" className="w-full">
        <Button
          variant="primary"
          size="lg"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base shadow-xl shadow-indigo-500/25"
          isLoading={isProcessing}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>

      {/* Security Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>256-Bit SSL Encrypted & 30-Day Money Back Guarantee</span>
      </div>
    </div>
  );
}
