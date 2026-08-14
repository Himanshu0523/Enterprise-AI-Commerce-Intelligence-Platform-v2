// components/ui/Card.jsx
import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl overflow-hidden transition-all duration-300',
        hoverable && 'hover:shadow-xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;