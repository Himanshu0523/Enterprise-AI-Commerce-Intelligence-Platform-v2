'use client';

import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function PasswordStrengthMeter({ password = '' }) {
  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Contains uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'Contains number (0-9)', valid: /[0-9]/.test(password) },
    { label: 'Contains special character (!@#$%^&*)', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  const getStrengthInfo = () => {
    if (!password) return { label: 'Enter Password', color: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-400' };
    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score <= 4) return { label: 'Good', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Cyber Secure', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getStrengthInfo();

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2 text-xs">
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500 dark:text-gray-400">Security Score:</span>
        <span className={`flex items-center gap-1 font-semibold ${strength.text}`}>
          {score === 5 ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
          {strength.label} ({score}/5)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 transition-all duration-300 rounded-full ${
              step <= score ? strength.color : 'bg-gray-200 dark:bg-gray-800'
            }`}
          />
        ))}
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {checks.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {item.valid ? (
              <Check className="h-3 w-3 text-emerald-500 shrink-0" />
            ) : (
              <X className="h-3 w-3 text-gray-300 dark:text-gray-600 shrink-0" />
            )}
            <span className={item.valid ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
