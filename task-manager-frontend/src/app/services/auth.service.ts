import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';

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
    // finalize : la session locale est supprimée dans TOUS les cas (succès ou erreur)
    return this.http.post(`${this.apiUrl}/logout`, { refreshToken }).pipe(
      finalize(() => this.clearSession())
    );
  }

  clearSession() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.clearSession(); // token expiré → on considère l'utilisateur déconnecté
        return false;
      }
      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }
}