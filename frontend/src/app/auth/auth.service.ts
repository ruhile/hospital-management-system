import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = `${environment.apiUrl}/api/auth`;
  
  // Track logged in user reactively
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    // Check if token and user exist in local storage on boot
    const storedUser = localStorage.getItem('user');
    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Get current user value synchronously
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Register a new user
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.base}/register`, userData).pipe(
      map(response => {
        // Save token and user details to local storage
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        return response;
      }),
      catchError(err => throwError(() => err))
    );
  }

  // Log in user
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.base}/login`, credentials).pipe(
      map(response => {
        // Save token and user details to local storage
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        return response;
      }),
      catchError(err => throwError(() => err))
    );
  }

  // Log out user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // Retrieve token from storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get current user details from profile endpoint to verify token
  checkSession(): Observable<any> {
    return this.http.get<any>(`${this.base}/me`).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }
}
