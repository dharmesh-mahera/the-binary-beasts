import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Replace with your actual environment file

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = `${environment.apiBaseUrl}/api/login`;

    constructor(private http: HttpClient) { }

    // Method to log in using backend API
    login(email: string, password: string): Observable<any> {
        const loginData = { email, password };

        // Include the Cookie in the headers (if needed)
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        // Send the login request to the API
        return this.http.post<any>(this.apiUrl, loginData, { headers });
    }

    // Store the token in localStorage if login is successful
    storeToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    // Method to check if the user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    // Method to log out
    logout(): void {
        localStorage.removeItem('auth_token');
    }
}
