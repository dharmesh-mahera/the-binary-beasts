import { useState, useEffect } from 'react';
import { Expense, ExpenseSummary } from '../types/expense';
import { expenseApi } from '../api/expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await expenseApi.getExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
      console.error('Error loading expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id' | 'created_at'>) => {
    try {
      setError(null);
      const expense = await expenseApi.addExpense(newExpense);
      await loadExpenses(); // Reload to get the latest data
      setShowAddForm(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
      console.error('Error adding expense:', err);
      return false;
    }
  };

  const handleEditExpense = async (updatedExpense: Omit<Expense, 'id' | 'created_at'>) => {
    if (!editingExpense) return false;
    
    try {
      setError(null);
      await expenseApi.updateExpense(editingExpense.id, updatedExpense);
      await loadExpenses(); // Reload to get the latest data
      setEditingExpense(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
      console.error('Error updating expense:', err);
      return false;
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setError(null);
      await expenseApi.deleteExpense(id);
      await loadExpenses(); // Reload to get the latest data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      console.error('Error deleting expense:', err);
      return false;
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expenseSummary: ExpenseSummary[] = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.category === expense.category);
    if (existingCategory) {
      existingCategory.total += expense.amount;
    } else {
      acc.push({ category: expense.category, total: expense.amount });
    }
    return acc;
  }, [] as ExpenseSummary[]);

  return {
    expenses,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    showAddForm,
    setShowAddForm,
    editingExpense,
    setEditingExpense,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    filteredExpenses,
    expenseSummary,
  };
}