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
    <nav aria-label="Breadcrumb" className="py-3 text-[11px] text-[#879087] overflow-x-auto whitespace-nowrap">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center text-[#879087] hover:text-[#315b49] transition-colors"
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
              <ChevronRight size={14} className="text-[#c6cbc3] flex-shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-[#1c2924] capitalize">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#315b49] capitalize transition-colors"
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
