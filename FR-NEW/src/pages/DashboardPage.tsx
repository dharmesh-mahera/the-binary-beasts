import React from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { ExpenseChart } from '../components/ExpenseChart';
import { SearchBar } from '../components/SearchBar';
import { useExpenses } from '../hooks/useExpenses';
import { PlusCircle } from 'lucide-react';

export function DashboardPage() {
  const {
    expenses,
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
  } = useExpenses();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Summary</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <ExpenseChart data={expenseSummary} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              {showAddForm || editingExpense ? (
                <ExpenseForm
                  onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
                  onClose={() => {
                    setShowAddForm(false);
                    setEditingExpense(null);
                  }}
                  initialData={editingExpense}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Add New Expense</h2>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <PlusCircle size={18} className="mr-2" />
                      Add Expense
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Expense List</h2>
              <div className="w-full sm:w-64">
                {/* <SearchBar value={searchQuery} onChange={setSearchQuery} /> */}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={setEditingExpense}
                onDelete={handleDeleteExpense}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}