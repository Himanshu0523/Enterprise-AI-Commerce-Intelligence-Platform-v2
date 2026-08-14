'use client';

import React from 'react';
import { MapPin, Truck, CreditCard, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Delivery', icon: Truck },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Review', icon: CheckCircle2 },
];

export default function CheckoutSteps({ currentStep = 1, onStepClick }) {
  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
        
        {/* Active Line Fill */}
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 -z-0"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 85}%`,
          }}
        />

        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <button
              key={step.id}
              onClick={() => isCompleted && onStepClick?.(step.id)}
              disabled={!isCompleted && !isActive}
              className={`relative z-10 flex flex-col items-center group focus:outline-none ${
                isCompleted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : isActive
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 ring-4 ring-indigo-500/20 shadow-lg'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>

              <span
                className={`mt-2 text-xs font-semibold tracking-tight transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : isCompleted
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
