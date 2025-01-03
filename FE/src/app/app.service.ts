import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = environment.apiUrl ; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch user details from the API
  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-user`);
  }
}
