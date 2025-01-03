import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Expense, ExpenseApiResponse } from './app.types';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private expenseApiUrl = `${environment.apiBaseUrl}/api/users/1/expenses`; // Replace with your actual API URL
    expenses: any
    constructor(private http: HttpClient) { }

    addExpense(expense: Partial<Expense>): Observable<Expense> {
        // if(expense.date) {
        //     expense.date = expense.date.toISOString().split('T')[0];
        // }
        
        return this.http.post<Expense>(this.expenseApiUrl, expense);
    }

    getExpenseById(id: number) {
        return this.expenses.find((f: any) => f.id === id);
      }

    getExpenses(): Observable<ExpenseApiResponse> {
        return this.http.get<ExpenseApiResponse>(this.expenseApiUrl);
    }

    updateExpense(expenseId: string, expense: Partial<Expense>): Observable<Expense> {
        // if(expense.date) {
        //     expense.date = expense.date.toISOString().split('T')[0];
        // }
        
        return this.http.put<Expense>(this.expenseApiUrl + '/' +  expenseId, expense);
    }


    
    deleteExpenses(id: number): Observable<any> {
        return this.http.delete<any>(`${this.expenseApiUrl}/${id}`);
    }
}
