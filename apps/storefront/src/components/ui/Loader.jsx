import React from 'react';
import clsx from 'clsx';

const Loader = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };
  return (
    <div
      className={clsx(
        'border-gray-200 border-t-gray-900 rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
};

export default Loader;