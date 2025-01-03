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

    constructor(private http: HttpClient) { }

    addExpense(expense: Partial<Expense>): Observable<Expense> {
        if(expense.date) {
            expense.date = expense.date.toISOString().split('T')[0];
        }
        
        return this.http.post<Expense>(this.expenseApiUrl, expense);
    }

    getExpenses(): Observable<ExpenseApiResponse> {
        return this.http.get<ExpenseApiResponse>(this.expenseApiUrl);
    }
}
