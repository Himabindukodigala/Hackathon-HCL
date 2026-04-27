import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api/auth';

  private tokenSignal = signal<string | null>(localStorage.getItem('auth_token'));
  private userSignal = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.tokenSignal());
  currentUser = this.userSignal.asReadonly();
  isAdmin = computed(() => this.userSignal()?.role === 'Admin');

  constructor() {
    if (this.tokenSignal()) {
      this.loadUserProfile();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    this.tokenSignal.set(response.token);
    this.userSignal.set({
      id: 0,
      name: response.name,
      email: response.email,
      role: response.role
    });
  }

  private loadUserProfile(): void {
    this.http.get<User>(`${this.apiUrl}/me`).subscribe({
      next: (user) => this.userSignal.set(user),
      error: () => this.logout()
    });
  }
}