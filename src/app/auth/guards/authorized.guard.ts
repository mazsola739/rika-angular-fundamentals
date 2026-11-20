import { inject } from '@angular/core'
import type { CanMatchFn } from '@angular/router'
import { AuthService } from '../services/auth.service'

/**
 * The courses are for logged-in users: everyone else is sent to /login. The course used canLoad,
 * which Angular has since replaced with canMatch: the lazy chunk still is not loaded for a guest.
 */
export const authorizedGuard: CanMatchFn = () => {
  const auth = inject(AuthService)
  return auth.isAuthorized() || auth.getLoginUrl()
}
