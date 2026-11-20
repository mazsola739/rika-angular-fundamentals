import { HttpClient } from '@angular/common/http'
import { Injectable, inject, signal } from '@angular/core'
import {
  BehaviorSubject,
  catchError,
  defer,
  delay,
  finalize,
  map,
  type Observable,
  of,
  timeout,
} from 'rxjs'
import snapshot from './swapi-snapshot.json'

export type Named = { name: string }
type Page = { results: Named[] }

export const SWAPI_URL = 'https://swapi.dev/api'

/** SWAPI is a free service and sometimes slow or down: after this long the saved copy answers. */
const TIMEOUT = 8000

/**
 * The Star Wars API of the RxJS task, as the course gave it: one request per call, and a loader
 * BehaviorSubject per kind of request. When SWAPI does not answer, a saved copy of its names
 * (swapi-snapshot.json, 82 characters and 60 planets) answers the same way.
 */
@Injectable({ providedIn: 'root' })
export class MockDataService {
  private readonly http = inject(HttpClient)

  readonly charactersLoader$ = new BehaviorSubject<boolean>(false)
  readonly planetsLoader$ = new BehaviorSubject<boolean>(false)
  /** True once an answer came from the saved copy. */
  readonly usedSnapshot = signal(false)

  getCharacters(searchTerm?: string): Observable<Named[]> {
    return this.request('people', snapshot.people, this.charactersLoader$, searchTerm)
  }

  getPlanets(searchTerm?: string): Observable<Named[]> {
    return this.request('planets', snapshot.planets, this.planetsLoader$, searchTerm)
  }

  getCharactersLoader(): Observable<boolean> {
    return this.charactersLoader$.asObservable()
  }

  getPlanetLoader(): Observable<boolean> {
    return this.planetsLoader$.asObservable()
  }

  private request(
    kind: 'people' | 'planets',
    saved: Named[],
    loader$: BehaviorSubject<boolean>,
    searchTerm?: string,
  ): Observable<Named[]> {
    const term = searchTerm?.trim() ?? ''
    return defer(() => {
      loader$.next(true)
      return this.http
        .get<Page>(`${SWAPI_URL}/${kind}/`, { params: term ? { search: term } : {} })
        .pipe(
          timeout(TIMEOUT),
          map((page) => page.results.map(({ name }) => ({ name }))),
          catchError(() => {
            this.usedSnapshot.set(true)
            return of(searchSnapshot(saved, term)).pipe(delay(300))
          }),
          finalize(() => loader$.next(false)),
        )
    })
  }
}

/** Like SWAPI: names containing the term, or the first page (10) without one. */
export function searchSnapshot(saved: Named[], term: string): Named[] {
  const wanted = term.toLowerCase()
  return wanted
    ? saved.filter(({ name }) => name.toLowerCase().includes(wanted))
    : saved.slice(0, 10)
}
