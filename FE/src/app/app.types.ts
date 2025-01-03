export interface Expense {
    id: number;               // Unique identifier for the expense
    amount: number;           // Amount of the expense
    date: any;               // Date the expense was recorded
    category: string;         // Category of the expense (e.g., 'Food', 'Travel')
    description: string;      // Description of the expense
  }

  export interface ExpenseApiResponse {
    expenses: Expense[],
    total: number;
  }
  
  