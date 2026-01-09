import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData } from '../models/user.interface';
import { API_BASE_URL } from '../constants/api.constants';
interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const savedUser = localStorage.getItem(this.userKey);
    const token = localStorage.getItem(this.tokenKey);

    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearAuthData();
      }
    }
  }

  // Real login with JSON Server
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.get<User[]>(`${API_BASE_URL}/users?email=${credentials.email}`)
      .pipe(
        map(users => {
          // Find user by email
          const user = users.find(u => u.email === credentials.email);

          if (!user) {
            throw new Error('User not found');
          }

          // In real app, you would hash passwords. For demo, compare plain text
          if (user.password !== credentials.password) {
            throw new Error('Invalid password');
          }

          // Remove password from user object before storing
          const { password, ...userWithoutPassword } = user;

          return userWithoutPassword as User;
        }),
        tap(user => {
          // Generate a simple token (in real app, this comes from server)
          const token = this.generateToken(user);
          this.setAuthData(user, token);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.message || 'Login failed'));
        })
      );
  }

  // Real registration with JSON Server
  register(userData: RegisterData): Observable<User> {
    // First check if user already exists
    return this.http.get<User[]>(`${API_BASE_URL}/users?email=${userData.email}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            throw new Error('Email already registered');
          }

          // Create new user
          const newUser: User = {
            id: Date.now(), // Generate ID
            email: userData.email,
            username: userData.email.split('@')[0], // Default username
            password: userData.password, // In real app, hash this
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone || '',
            address: userData.address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            role: 'user',
            createdAt: new Date().toISOString()
          };

          return newUser;
        }),
        // Save user to JSON Server
        switchMap(newUser =>
          this.http.post<User>(`${API_BASE_URL}/users`, newUser)
        ),
        map(savedUser => {
          // Remove password from response
          const { password, ...userWithoutPassword } = savedUser;
          return userWithoutPassword as User;
        }),
        tap(user => {
          // Generate token and login
          const token = this.generateToken(user);
          this.setAuthData(user, token);
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => new Error(error.message || 'Registration failed'));
        })
      );
  }

  private generateToken(user: User): string {
    // In real app, this would come from server
    // For demo, create a simple token
    return btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
  }

  private setAuthData(user: User, token: string): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.clearAuthData();
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;

    // Check if token is expired (for demo)
    try {
      const tokenData = JSON.parse(atob(token));
      return tokenData.exp > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
