export type Category = 'Food' | 'Travel' | 'Utilities' | 'Entertainment' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  created_at?: string;
}

export interface ExpenseSummary {
  category: Category;
  total: number;
}