import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, throwError } from 'rxjs'
import { API_URL } from '../../core/api'
import { UserStoreService } from '../../user/services/user-store.service'
import { AuthService } from '../services/auth.service'

/**
 * Adds the login token to the requests to our backend (never to other sites), and on a 401 forgets
 * the token and goes to the login page: the token expired or the session ended elsewhere.
 */
export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(inject(API_URL))) return next(request)

  const auth = inject(AuthService)
  const userStore = inject(UserStoreService)
  const router = inject(Router)
  const token = auth.getToken()
  const authorized = token ? request.clone({ setHeaders: { Authorization: token } }) : request

  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && auth.isAuthorized()) {
        auth.forgetToken()
        userStore.clear()
        void router.navigate(['/login'])
      }
      return throwError(() => error)
    }),
  )
}
