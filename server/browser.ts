import { type Api, createApi } from './api'
import { localStorageStorage } from './storage'

/** localStorage key of the backend's data in the browser. */
export const BROWSER_DATA_KEY = 'rika-angular-fundamentals:data'

/**
 * The backend inside the browser: GitHub Pages serves only static files, so on the live site
 * the app sends its requests to this instead of a server. Same code as the Bun server,
 * with the data kept in the visitor's localStorage.
 */
export function createBrowserApi(): Api {
  return createApi({ storage: localStorageStorage(BROWSER_DATA_KEY) })
}
