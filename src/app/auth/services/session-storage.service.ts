import { Injectable, inject } from '@angular/core'
import { WINDOW } from '../../core/window'
import { STORAGE_PREFIX } from '../../site'

/** The session storage key of the login token. */
export const TOKEN = `${STORAGE_PREFIX}SESSION_TOKEN`

/**
 * Keeps the login token in sessionStorage: it survives a reload and ends with the tab.
 * In private mode or with blocked storage the token lives in memory until the page is closed.
 */
@Injectable({ providedIn: 'root' })
export class SessionStorageService {
  private readonly window = inject(WINDOW)
  private fallback: string | null = null

  setToken(token: string): void {
    this.fallback = token
    try {
      this.window.sessionStorage.setItem(TOKEN, token)
    } catch {
      // Kept in memory only.
    }
  }

  getToken(): string | null {
    try {
      return this.window.sessionStorage.getItem(TOKEN) ?? this.fallback
    } catch {
      return this.fallback
    }
  }

  deleteToken(): void {
    this.fallback = null
    try {
      this.window.sessionStorage.removeItem(TOKEN)
    } catch {
      // Nothing to delete.
    }
  }
}
