import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withHashLocation,
  withInMemoryScrolling,
} from '@angular/router'
import { provideEffects } from '@ngrx/effects'
import { provideStore } from '@ngrx/store'
import { routes } from './app.routes'
import { tokenInterceptor } from './auth/interceptors/token.interceptor'
import { usesBrowserApi } from './core/api'
import { browserBackendInterceptor } from './core/browser-backend.interceptor'
import { provideIcons } from './core/icons'
import { PageTitleStrategy } from './core/page-title.strategy'
import { effects, reducers } from './store'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hash routing: GitHub Pages serves only index.html, so /#/courses/add works on a reload too.
    provideRouter(
      routes,
      withHashLocation(),
      withComponentInputBinding(),
      // A new page (e.g. the next lesson) starts at the top; Back returns to where you were.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    provideHttpClient(
      withFetch(),
      withInterceptors([
        tokenInterceptor,
        // No server (the live site, bun run dev): the backend runs in the browser.
        ...(usesBrowserApi() ? [browserBackendInterceptor] : []),
      ]),
    ),
    provideStore(reducers),
    provideEffects(...effects),
    provideIcons(),
  ],
}
