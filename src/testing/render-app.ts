import { provideLocationMocks } from '@angular/common/testing'
import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { createApi } from '../../server/api'
import { memoryStorage } from '../../server/storage'
import { App } from '../app/app'
import { appConfig } from '../app/app.config'
import { BROWSER_API } from '../app/core/api'

/**
 * The whole app, as on the live site, with the backend in memory: every test starts from the seed
 * data. Faster password hashing keeps the logins quick.
 */
export async function renderApp(url = '/') {
  const api = createApi({ storage: memoryStorage(), passwordIterations: 1_000 })
  TestBed.configureTestingModule({
    providers: [
      ...appConfig.providers,
      provideLocationMocks(),
      { provide: BROWSER_API, useValue: api },
    ],
  })
  const fixture = TestBed.createComponent(App)
  const router = TestBed.inject(Router)
  const root = fixture.nativeElement as HTMLElement

  /** Waits for requests, navigation and rendering to finish. */
  const settle = async () => {
    await fixture.whenStable()
    fixture.detectChanges()
    await fixture.whenStable()
  }

  const navigate = async (target: string) => {
    await router.navigateByUrl(target)
    await settle()
  }

  await navigate(url)
  return { fixture, router, api, root, settle, navigate, path: () => router.url }
}

/** The form field that a label names, like a user finds it. */
export function field<T extends HTMLElement = HTMLInputElement>(
  root: HTMLElement,
  label: string,
): T {
  const found = [...root.querySelectorAll('label')].find(
    (item) => item.textContent?.trim() === label,
  )
  const control = found?.htmlFor ? root.querySelector<T>(`#${CSS.escape(found.htmlFor)}`) : null
  if (!control) throw new Error(`No field labelled "${label}"`)
  return control
}

/** A button by its text or its accessible name (icon buttons). */
export function button(root: HTMLElement, name: string): HTMLButtonElement {
  const found = findButton(root, name)
  if (!found) throw new Error(`No button "${name}"`)
  return found
}

export function findButton(root: HTMLElement, name: string): HTMLButtonElement | undefined {
  const wanted = name.toLowerCase()
  return [...root.querySelectorAll('button')].find(
    (item) =>
      item.getAttribute('aria-label')?.toLowerCase() === wanted ||
      item.textContent?.trim().toLowerCase() === wanted,
  )
}

/** Types into a field (input event) and leaves it (blur, so it counts as touched). */
export function type(control: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  control.value = value
  control.dispatchEvent(new Event('input', { bubbles: true }))
  control.dispatchEvent(new Event('blur'))
}

export const text = (root: HTMLElement) => root.textContent?.replace(/\s+/g, ' ') ?? ''

/** Logs in through the login page. */
export async function logIn(
  app: Awaited<ReturnType<typeof renderApp>>,
  email = 'admin@email.com',
  password = 'admin123',
) {
  await app.navigate('/login')
  type(field(app.root, 'Email'), email)
  type(field(app.root, 'Password'), password)
  button(app.root, 'Login').click()
  await app.settle()
}
