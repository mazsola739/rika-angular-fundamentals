import { DOCUMENT } from '@angular/common'
import { InjectionToken, inject } from '@angular/core'

/** The browser window, injected, so the tests can hand the services a window of their own. */
export const WINDOW = new InjectionToken<Window>('WINDOW', {
  providedIn: 'root',
  factory: () => {
    const view = inject(DOCUMENT).defaultView
    if (!view) throw new Error('This app runs in a browser window.')
    return view
  },
})
