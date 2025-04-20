import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { User, UserLogin, UserRegister, AuthResponse } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenKey = 'auth_token';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.loadUserFromToken();
  }

  register(user: UserRegister): Observable<User> {
    return this.http.post<User>(`${this.apiConfig.getAuthUrl()}/register`, user);
  }

  login(credentials: UserLogin): Observable<AuthResponse> {
    // Convert to form data as required by FastAPI's OAuth2PasswordRequestForm
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    return this.http.post<AuthResponse>(`${this.apiConfig.getAuthUrl()}/token`, formData)
      .pipe(
        tap(response => {
          this.setToken(response.access_token);
          this.loadUserFromToken();
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user: User = {
          id: decoded.id || 1,
          username: decoded.sub,
          email: decoded.email || 'user@example.com',
          created_at: new Date().toISOString(),
          rol: decoded.role || 'usuario',
          last_login: decoded.last_login
        };
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error decoding token', error);
        this.logout();
      }
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === 'administrador';
  }
}
