import {
  HttpErrorResponse,
  HttpHeaders,
  type HttpInterceptorFn,
  type HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { inject, PendingTasks } from '@angular/core'
import { defer, finalize, from, of, switchMap, throwError } from 'rxjs'
import type { Api } from '../../../server/api'
import { BROWSER_API, BROWSER_API_URL } from './api'

/**
 * The last interceptor of the chain when there is no server: requests to BROWSER_API_URL go to the
 * backend in the browser (server/browser.ts) instead of the network. HttpClient, the token
 * interceptor and the services do not know the difference; every other request (SWAPI on the RxJS
 * page) goes on to the network as usual.
 */
export const browserBackendInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(BROWSER_API_URL)) return next(request)

  const api = inject(BROWSER_API)
  // Angular waits for pending tasks (e.g. fixture.whenStable() in the tests), as for real requests.
  const pendingTasks = inject(PendingTasks)

  return defer(() => {
    const done = pendingTasks.add()
    return from(answer(api, request)).pipe(finalize(done))
  }).pipe(
    switchMap(({ response, payload }) => {
      const init = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        status: response.status,
        statusText: response.statusText,
        url: request.urlWithParams,
      }
      return response.ok
        ? of(new HttpResponse({ ...init, body: payload }))
        : throwError(() => new HttpErrorResponse({ ...init, error: payload }))
    }),
  )
}

/** HttpRequest → fetch Request → the backend → its Response and JSON body. */
async function answer(api: Api, request: HttpRequest<unknown>) {
  const headers = new Headers()
  for (const name of request.headers.keys()) {
    headers.set(name, request.headers.getAll(name)?.join(', ') ?? '')
  }
  const body = request.serializeBody()
  if (body !== null && !headers.has('Content-Type')) {
    headers.set('Content-Type', request.detectContentTypeHeader() ?? 'application/json')
  }

  const response = await api.fetch(
    new Request(request.urlWithParams, {
      method: request.method,
      headers,
      body: body === null ? undefined : (body as BodyInit),
    }),
  )
  const text = await response.text()
  const payload: unknown = text ? JSON.parse(text) : null
  return { response, payload }
}
