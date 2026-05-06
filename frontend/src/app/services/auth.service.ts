import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export type UserRole = 'ADMIN' | 'USER';

interface AuthResponse {
  token: string;
  user: User;
}

interface MessageResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:9090/api/auth';
  private readonly TOKEN_KEY = 'pm_token';
  private readonly SESSION_KEY = 'pm_session';

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadSession());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(fullName: string, email: string, phone: string, password: string, role: UserRole = 'USER'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, { fullName, email, phone, password, role })
      .pipe(tap(response => this.setSession(response)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(tap(response => this.setSession(response)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  sendResetLink(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.API_URL}/forgot-password`, { email });
  }

  resetPassword(_token: string, _newPassword: string): Observable<MessageResponse> {
    return new Observable<MessageResponse>(subscriber => {
      subscriber.next({ message: 'Password reset is not configured in the JWT backend yet.' });
      subscriber.complete();
    });
  }

  get currentUser(): User | null { return this.currentUserSubject.value; }
  get token(): string | null      { return localStorage.getItem(this.TOKEN_KEY); }
  get isLoggedIn(): boolean      { return !!this.token && !!this.currentUserSubject.value; }
  get isAdmin(): boolean         { return this.currentUser?.role === 'ADMIN'; }

  userKey(suffix: string): string {
    return `pm_${this.currentUser?.id ?? 'anon'}_${suffix}`;
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private loadSession(): User | null {
    try { return this.normalizeUser(JSON.parse(localStorage.getItem(this.SESSION_KEY) ?? 'null')); }
    catch { return null; }
  }

  private normalizeUser(user: User | null): User | null {
    if (!user) return null;
    return {
      ...user,
      id: String(user.id),
      role: user.role ?? 'USER'
    };
  }
}
