import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/api';

const categories = ['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'];

const getCategoryColor = (category) => {
    const colors = {
        Food: 'bg-green-100 text-green-800',
        Travel: 'bg-blue-100 text-blue-800',
        Utilities: 'bg-purple-100 text-purple-800',
        Entertainment: 'bg-pink-100 text-pink-800',
        Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.Other;
};

const ExpenseList = ({ onEdit, refreshKey }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchExpenses();
    }, [refreshKey]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await expenseService.getExpenses(1);
            setExpenses(response.expenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
            setTotalExpenses(response.total);
            setError(null);
        } catch (err) {
            setError('Failed to fetch expenses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (expenseId) => {
        try {
            await expenseService.deleteExpense(1, expenseId);
            fetchExpenses();
        } catch (err) {
            setError('Failed to delete expense');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    const filteredExpenses = expenses
        .filter(expense => selectedCategory === 'All' || expense.category === selectedCategory)
        .filter(expense => 
            searchQuery === '' || 
            expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.amount.toString().includes(searchQuery)
        );

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Expenses</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <div className="w-full sm:w-64">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search expenses..."
                            />
                        </div>
                    </div>
                    <div className="w-full sm:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-shadow duration-200"
                        >
                            <option value="All">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-600">Total Expenses: {filteredExpenses.length}</p>
                        <p className="text-xl font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredExpenses.map((expense) => (
                    <div 
                        key={expense.id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg">{expense.description}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-1 rounded-full text-sm ${getCategoryColor(expense.category)}`}>
                                        {expense.category}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                    Created: {new Date(expense.date).toLocaleDateString()}
                                    </span>
                                </div>
                                {/* <p className="text-sm text-gray-500 mt-1">
                                    Created: {new Date(expense.created_at).toLocaleString()}
                                </p> */}
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-green-600">
                                ₹{parseFloat(expense.amount).toFixed(2)}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(expense)}
                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                        title="Edit expense"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Delete expense"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredExpenses.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No expenses found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseList;
