import { HttpErrorResponse } from '@angular/common/http'
import { InjectionToken } from '@angular/core'
import type { Api } from '../../../server/api'
import { createBrowserApi } from '../../../server/browser'
import { environment } from '../../environments/environment'

export type {
  ApiSuccess,
  Author,
  Course,
  CourseInput,
  LoginResult,
  PublicUser,
  Role,
} from '../../../server/types'

/**
 * The address the in-browser backend answers on. Nothing is listening there: the
 * browserBackendInterceptor catches these requests before they reach the network.
 */
export const BROWSER_API_URL = 'https://courses.api'

/** Where the backend is: the Bun server (`bun run dev:server`) or the backend in the browser. */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl ?? BROWSER_API_URL,
})

/** The backend that runs in the browser, with the data in localStorage. The tests give it memory storage. */
export const BROWSER_API = new InjectionToken<Api>('BROWSER_API', {
  providedIn: 'root',
  factory: createBrowserApi,
})

/** True when there is no server: the live site and `bun run dev`. */
export const usesBrowserApi = () => environment.apiUrl === null

/** The message the backend sent with an error, or a short one of our own. */
export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { result?: unknown; errors?: unknown } | null
    if (typeof body?.result === 'string') return body.result
    if (Array.isArray(body?.errors) && body.errors.length) return body.errors.join(' ')
    if (error.status === 0) return 'The server cannot be reached.'
    return `The request failed (${error.status}).`
  }
  return error instanceof Error ? error.message : 'Something went wrong.'
}
