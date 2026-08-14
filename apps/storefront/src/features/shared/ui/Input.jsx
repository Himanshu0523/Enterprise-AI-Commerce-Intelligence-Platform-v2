'use client';

import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    rightIcon: RightIcon,
    onRightIconClick,
    type = 'text',
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={`w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            Icon ? 'pl-11' : ''
          } ${RightIcon ? 'pr-11' : ''} ${
            error
              ? 'border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/80'
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
          } ${className}`}
          {...props}
        />

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {error ? (
        <span className="text-xs text-rose-500 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>
      ) : null}
    </div>
  );
});

export default Input;
