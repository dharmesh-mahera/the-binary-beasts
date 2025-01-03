import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Expense } from './app.types';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private baseUrl = environment.apiUrl; // Replace with your actual API URL

    constructor(private http: HttpClient) { }

    addExpense(expense: Partial<Expense>): Observable<Expense> {
        return this.http.post<Expense>(this.baseUrl, expense);
    }

    getExpenses(): Observable<Expense[]> {
        return this.http.get<Expense[]>(this.baseUrl);
    }
}
