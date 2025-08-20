'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'tabs';
}

export default function Navigation({
  items,
  className = '',
  variant = 'horizontal'
}: NavigationProps) {
  const [activeItem, setActiveItem] = useState(0);

  const baseClasses = 'flex items-center space-x-1';
  
  const variantClasses = {
    horizontal: 'flex-row space-x-1',
    vertical: 'flex-col space-y-1',
    tabs: 'flex-row space-x-1'
  };

  const itemClasses = {
    horizontal: 'px-3 py-2 rounded-lg transition-all duration-300',
    vertical: 'px-3 py-2 rounded-lg transition-all duration-300 w-full',
    tabs: 'px-4 py-2 border-b-2 transition-all duration-300'
  };

  const activeClasses = {
    horizontal: 'bg-green-100 text-green-700 shadow-sm',
    vertical: 'bg-green-100 text-green-700 shadow-sm',
    tabs: 'border-green-500 text-green-700'
  };

  const inactiveClasses = {
    horizontal: 'text-gray-600 hover:text-green-600 hover:bg-green-50',
    vertical: 'text-gray-600 hover:text-green-600 hover:bg-green-50',
    tabs: 'border-transparent text-gray-600 hover:text-green-600'
  };

  return (
    <nav className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.href}
          className={`${itemClasses[variant]} ${
            index === activeItem ? activeClasses[variant] : inactiveClasses[variant]
          } cursor-pointer hover:scale-105 transition-transform duration-200`}
          onClick={() => setActiveItem(index)}
        >
          <Link href={item.href} className="flex items-center space-x-2">
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            <span className="font-medium">{item.label}</span>
          </Link>
        </div>
      ))}
    </nav>
  );
}

// Composant de navigation avec breadcrumbs
export function BreadcrumbNavigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <Link
            href={item.href}
            className={`hover:text-green-600 transition-colors ${
              index === items.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'
            }`}
          >
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      ))}
    </nav>
  );
}

// Composant de pagination
export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Précédent
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition-all duration-300 ${
            page === currentPage
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Suivant
      </button>
    </nav>
  );
}
