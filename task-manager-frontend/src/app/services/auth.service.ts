import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5233/gateway/auth';
  private tokenKey = 'accessToken';
  private refreshKey = 'refreshToken';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, fullName: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password, fullName });
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.accessToken);
        localStorage.setItem(this.refreshKey, res.refreshToken);
      })
    );
  }

  logout() {
    const refreshToken = localStorage.getItem(this.refreshKey);
    return this.http.post(`${this.apiUrl}/logout`, { refreshToken }).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshKey);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}