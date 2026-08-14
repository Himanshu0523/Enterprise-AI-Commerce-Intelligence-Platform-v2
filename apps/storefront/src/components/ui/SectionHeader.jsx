import React from 'react';
import clsx from 'clsx';

const SectionHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={clsx('flex flex-wrap justify-between items-end gap-4 mb-6', className)}>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;