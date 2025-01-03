import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private loginUrl = `${environment.apiBaseUrl}/api/login`;

    constructor(private http: HttpClient) { }

    login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post<any>(this.loginUrl, credentials);
    }
}
