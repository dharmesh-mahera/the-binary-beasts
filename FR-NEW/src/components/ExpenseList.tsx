import React, { useState } from 'react';
import { Edit2, Trash2, Filter } from 'lucide-react';
import { Expense, Category } from '../types/expense';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categories: Category[] = ['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'];

const getCategoryColor = (category: string) => {
  const colors = {
    Food: 'bg-green-100 text-green-800',
    Travel: 'bg-blue-100 text-blue-800',
    Utilities: 'bg-purple-100 text-purple-800',
    Entertainment: 'bg-pink-100 text-pink-800',
    Other: 'bg-gray-100 text-gray-800',
  };
  return colors[category as keyof typeof colors] || colors.Other;
};

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedCategory);

  if (filteredExpenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No expenses found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category | 'All')}
            className="block w-40 rounded-lg border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-shadow duration-200"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredExpenses.map((expense) => (
              <tr 
                key={expense.id} 
                className="hover:bg-gray-50/50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(expense.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{expense.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ₹{expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                    title="Edit expense"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-150"
                    title="Delete expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;