import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { expenseService } from '../services/api';

const ExpensesPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [editingExpense, setEditingExpense] = useState(null);
    const [showAddForm, setShowAddForm] = useState(true);

    const handleExpenseAdded = () => {
        setRefreshKey(prev => prev + 1);
        setShowAddForm(true);
    };

    const handleExpenseUpdated = () => {
        setRefreshKey(prev => prev + 1);
        setEditingExpense(null);
        setShowAddForm(true);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setShowAddForm(false);
    };

    const handleFormClose = () => {
        setEditingExpense(null);
        setShowAddForm(true);
    };

    const handleSubmit = async (expenseData) => {
        if (editingExpense) {
            await expenseService.updateExpense(1, editingExpense.id, expenseData);
            handleExpenseUpdated();
        } else {
            await expenseService.addExpense(1, expenseData);
            handleExpenseAdded();
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Expense Manager</h1>
            
            <div className="max-w-4xl mx-auto">
                {showAddForm || editingExpense ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <ExpenseForm 
                            onSubmit={handleSubmit}
                            onClose={editingExpense ? handleFormClose : undefined}
                            initialData={editingExpense}
                        />
                    </div>
                ) : (
                    <div className="text-center mb-8">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Add New Expense
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <ExpenseList 
                        key={refreshKey}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExpensesPage;
