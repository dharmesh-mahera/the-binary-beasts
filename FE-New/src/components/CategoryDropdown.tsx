import React from 'react';
import { Category } from '../types/expense';

interface CategoryDropdownProps {
  value: Category;
  onChange: (category: Category) => void;
  className?: string;
}

const categories: Category[] = ['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'];

export function CategoryDropdown({ value, onChange, className = '' }: CategoryDropdownProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Category)}
        className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-shadow duration-200"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
} 