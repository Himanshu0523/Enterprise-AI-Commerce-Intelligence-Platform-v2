'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';

const steps = [
  { label: 'Cart Review', path: '/checkout' },
  { label: 'Shipping', path: '/checkout/shipping' },
  { label: 'Payment', path: '/checkout/payment' },
  { label: 'Confirmation', path: '/checkout/confirmation' },
];

export default function CheckoutStepper() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((step) => pathname.startsWith(step.path));
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          const isLast = idx === steps.length - 1;

          return (
            <div key={idx} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check size={18} /> : idx + 1}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    isActive ? 'font-medium text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    idx < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}