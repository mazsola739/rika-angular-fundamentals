import { computed, Injectable, inject, signal } from '@angular/core'
import { finalize, map, type Observable, of, shareReplay, tap } from 'rxjs'
import type { PublicUser } from '../../core/api'
import { UserService } from './user.service'

/**
 * The logged-in user's name and role. The course's name$$ / isAdmin$$ BehaviorSubjects are a
 * private signal here, with read-only views for everyone else.
 */
@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private readonly userService = inject(UserService)

  private readonly user$$ = signal<PublicUser | null>(null)
  private loading$: Observable<PublicUser> | null = null

  readonly user = this.user$$.asReadonly()
  readonly name = computed(() => this.user$$()?.name ?? '')
  readonly isAdmin = computed(() => this.user$$()?.role === 'admin')

  /** Loads the user once; calls while it loads share the same request. */
  getUser(): Observable<PublicUser> {
    const known = this.user$$()
    if (known) return of(known)
    this.loading$ ??= this.userService.getUser().pipe(
      tap((user) => this.user$$.set(user)),
      finalize(() => {
        this.loading$ = null
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    )
    return this.loading$
  }

  /** True when the user (loaded if needed) is an admin. */
  isAdmin$(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user.role === 'admin'))
  }

  /** After a logout, so the next user starts clean. */
  clear(): void {
    this.user$$.set(null)
    this.loading$ = null
  }
}
