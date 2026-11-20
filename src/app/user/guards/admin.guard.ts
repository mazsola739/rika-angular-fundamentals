import { inject } from '@angular/core'
import { type CanActivateFn, Router } from '@angular/router'
import { catchError, map, of } from 'rxjs'
import { UserStoreService } from '../services/user-store.service'

/** Adding and editing courses is for admins: a student is sent back to the courses. */
export const adminGuard: CanActivateFn = () => {
  const toCourses = inject(Router).createUrlTree(['/courses'])
  return inject(UserStoreService)
    .isAdmin$()
    .pipe(
      map((isAdmin) => isAdmin || toCourses),
      catchError(() => of(toCourses)),
    )
}
