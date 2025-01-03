import { Expense } from '../types/expense';

const BASE_URL = 'https://6ad7-27-109-3-34.ngrok-free.app/api';
const USER_ID = '1'; // We can make this dynamic later

export const expenseApi = {
  async getExpenses() {
    const response = await fetch(`${BASE_URL}/users/${USER_ID}/expenses`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    const data = await response.json();
    return data.expenses.map((expense: any) => ({
      id: expense.id.toString(),
      amount: parseFloat(expense.amount),
      description: expense.description,
      category: expense.category,
      date: expense.date,
      created_at: expense.created_at
    }));
  },

  async addExpense(expense: Omit<Expense, 'id'>) {
    const response = await fetch(`${BASE_URL}/users/${USER_ID}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    
    if (!response.ok) throw new Error('Failed to add expense');
    const data = await response.json();
    return {
      id: data.expense.id.toString(),
      amount: parseFloat(data.expense.amount),
      description: data.expense.description,
      category: data.expense.category,
      date: data.expense.date,
      created_at: data.expense.created_at
    };
  },

  async updateExpense(id: string, expense: Omit<Expense, 'id'>) {
    const response = await fetch(`${BASE_URL}/users/${USER_ID}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    
    if (!response.ok) throw new Error('Failed to update expense');
    const data = await response.json();
    return {
      id: data.expense.id.toString(),
      amount: parseFloat(data.expense.amount),
      description: data.expense.description,
      category: data.expense.category,
      date: data.expense.date,
      created_at: data.expense.created_at
    };
  },

  async deleteExpense(id: string) {
    const response = await fetch(`${BASE_URL}/users/${USER_ID}/expenses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete expense');
    return await response.json();
  }
};