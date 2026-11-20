import { HttpClient } from '@angular/common/http'
import { Injectable, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, finalize, map, type Observable, of, tap } from 'rxjs'
import { API_URL, type ApiSuccess, type LoginResult } from '../../core/api'
import { SessionStorageService } from './session-storage.service'

export type LoginCredentials = { email: string; password: string }
export type NewUser = LoginCredentials & { name: string }

/**
 * Login, registration and logout. The course asked for a private BehaviorSubject and a public
 * Observable for the login state; today the same pair is a private signal and its read-only view.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = inject(API_URL)
  private readonly router = inject(Router)
  private readonly sessionStorage = inject(SessionStorageService)

  private readonly isAuthorized$$ = signal(this.sessionStorage.getToken() !== null)
  /** True while there is a login token. */
  readonly isAuthorized = this.isAuthorized$$.asReadonly()

  /** The token for the Authorization header, e.g. "Bearer 4f…". */
  getToken(): string | null {
    return this.sessionStorage.getToken()
  }

  login(user: LoginCredentials): Observable<void> {
    return this.http.post<LoginResult>(`${this.apiUrl}/login`, user).pipe(
      tap(({ result }) => {
        this.sessionStorage.setToken(result)
        this.isAuthorized$$.set(true)
      }),
      map(() => undefined),
    )
  }

  register(user: NewUser): Observable<string> {
    return this.http
      .post<ApiSuccess<string>>(`${this.apiUrl}/register`, user)
      .pipe(map(({ result }) => result))
  }

  /** Ends the session on the backend too; the token is forgotten even if that request fails. */
  logout(): Observable<void> {
    return this.http.delete<ApiSuccess<string>>(`${this.apiUrl}/logout`).pipe(
      map(() => undefined),
      catchError(() => of(undefined)),
      finalize(() => this.forgetToken()),
    )
  }

  /** Forgets the token without asking the backend: after a 401, or when the demo data is reset. */
  forgetToken(): void {
    this.sessionStorage.deleteToken()
    this.isAuthorized$$.set(false)
  }

  getLoginUrl() {
    return this.router.createUrlTree(['/login'])
  }
}
