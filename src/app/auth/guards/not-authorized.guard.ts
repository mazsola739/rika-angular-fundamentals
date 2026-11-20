import { inject } from '@angular/core'
import { type CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'

/** Login and registration are for guests: a logged-in user goes to the courses. */
export const notAuthorizedGuard: CanActivateFn = () =>
  !inject(AuthService).isAuthorized() || inject(Router).createUrlTree(['/courses'])
