import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, LineChart } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <LineChart size={28} className="text-white" />
            <h1 className="text-2xl font-bold text-white">Expense Tracker</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-white/90 bg-white/10 px-4 py-2 rounded-full">
                <User size={20} className="mr-2" />
                <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border-2 border-white/20 text-sm font-medium rounded-full text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}