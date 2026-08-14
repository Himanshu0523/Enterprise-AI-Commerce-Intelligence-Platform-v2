import React from 'react';
import clsx from 'clsx';

const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    sale: 'bg-red-500 text-white',
    new: 'bg-green-500 text-white',
    featured: 'bg-amber-400 text-gray-900',
  };
  return (
    <span
      className={clsx(
        'inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;