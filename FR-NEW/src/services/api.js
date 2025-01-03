const BASE_URL = 'https://6ad7-27-109-3-34.ngrok-free.app/api';

export const expenseService = {
    // Get all expenses for a user
    async getExpenses(userId) {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}/expenses`);
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching expenses:', error);
            throw error;
        }
    },

    // Add a new expense
    async addExpense(userId, expenseData) {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            });
            if (!response.ok) {
                throw new Error('Failed to add expense');
            }
            return await response.json();
        } catch (error) {
            console.error('Error adding expense:', error);
            throw error;
        }
    },

    // Update an existing expense
    async updateExpense(userId, expenseId, expenseData) {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}/expenses/${expenseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            });
            if (!response.ok) {
                throw new Error('Failed to update expense');
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating expense:', error);
            throw error;
        }
    },

    // Delete an expense
    async deleteExpense(userId, expenseId) {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}/expenses/${expenseId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete expense');
            }
            return await response.json();
        } catch (error) {
            console.error('Error deleting expense:', error);
            throw error;
        }
    }
};
