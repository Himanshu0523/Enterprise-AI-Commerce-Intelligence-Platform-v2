'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} label
 * @property {string} [href]
 */

/**
 * Breadcrumbs Component
 * @param {{ items: BreadcrumbItem[] }} props
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
            title="Home"
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
              {isLast || !item.href ? (
                <span className="font-medium text-gray-900 capitalize">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-indigo-600 capitalize transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
