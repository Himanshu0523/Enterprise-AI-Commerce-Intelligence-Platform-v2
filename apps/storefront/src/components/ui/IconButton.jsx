import React from 'react';
import clsx from 'clsx';

const IconButton = ({ icon, onClick, className = '', label = 'button', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400',
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;