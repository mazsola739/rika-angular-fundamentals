import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { BehaviorSubject, of, Subject } from 'rxjs'
import { MockDataService, type Named, SWAPI_URL, searchSnapshot } from './mock-data.service'
import StarWars, { SEARCH_DEBOUNCE } from './star-wars'

const names = (...items: string[]): Named[] => items.map((name) => ({ name }))

/** A stand-in for SWAPI: every call is recorded and answered by the test. */
function fakeService() {
  const charactersLoader$ = new BehaviorSubject(false)
  const planetsLoader$ = new BehaviorSubject(false)
  const searches: string[] = []
  return {
    searches,
    charactersLoader$,
    planetsLoader$,
    usedSnapshot: () => false,
    getCharacters: (term?: string) => {
      searches.push(term ?? '')
      return of(term ? names(`${term} result`) : names('Luke Skywalker', 'C-3PO'))
    },
    getPlanets: () => of(names('Tatooine')),
    getCharactersLoader: () => charactersLoader$,
    getPlanetLoader: () => planetsLoader$,
  }
}

async function render() {
  const service = fakeService()
  TestBed.configureTestingModule({ providers: [{ provide: MockDataService, useValue: service }] })
  const fixture = TestBed.createComponent(StarWars)
  await fixture.whenStable()
  const root = fixture.nativeElement as HTMLElement
  const input = root.querySelector('#character-search') as HTMLInputElement
  const typeIn = (value: string) => {
    input.value = value
    input.dispatchEvent(new Event('input'))
  }
  return { fixture, service, root, typeIn }
}

describe('the RxJS page', () => {
  afterEach(() => vi.useRealTimers())

  it('searches from 3 letters on, once the typing stopped, the last term only', async () => {
    const { fixture, service, root, typeIn } = await render()
    // Fake time for debounceTime only: Angular's own rendering needs the real timers.
    vi.useFakeTimers()

    typeIn('lu')
    vi.advanceTimersByTime(SEARCH_DEBOUNCE)
    expect(service.searches).toEqual([])

    typeIn('luk')
    vi.advanceTimersByTime(100)
    typeIn('luke')
    vi.advanceTimersByTime(SEARCH_DEBOUNCE)
    expect(service.searches).toEqual(['luke'])

    vi.useRealTimers()
    await fixture.whenStable()
    expect(root.textContent).toContain('luke result')
  })

  it('loads characters and planets into one list', async () => {
    const { fixture, root } = await render()
    const load = [...root.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Load Characters And Planets'),
    )
    load?.click()
    await fixture.whenStable()
    const items = [...root.querySelectorAll('ul li')].map((item) => item.textContent?.trim())
    expect(items).toEqual(expect.arrayContaining(['Luke Skywalker', 'C-3PO', 'Tatooine']))
  })

  it('shows the loader while both requests run', async () => {
    const { fixture, service, root } = await render()
    service.charactersLoader$.next(true)
    await fixture.whenStable()
    expect(root.querySelector('.loader')).toBeNull()

    service.planetsLoader$.next(true)
    await fixture.whenStable()
    expect(root.querySelector('.loader')).not.toBeNull()

    service.charactersLoader$.next(false)
    await fixture.whenStable()
    expect(root.querySelector('.loader')).toBeNull()
  })

  it('stops listening to the loaders when the page is left', async () => {
    const { fixture, service } = await render()
    const loaders = service.charactersLoader$ as unknown as Subject<boolean>
    expect(loaders.observed).toBe(true)
    fixture.destroy()
    expect(loaders.observed).toBe(false)
  })
})

describe('the Star Wars service', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  )

  it('asks SWAPI and keeps only the names, with the loader on meanwhile', () => {
    const service = TestBed.inject(MockDataService)
    const http = TestBed.inject(HttpTestingController)
    let result: Named[] = []
    service.getCharacters('sky').subscribe((answer) => {
      result = answer
    })
    expect(service.charactersLoader$.value).toBe(true)

    http
      .expectOne(`${SWAPI_URL}/people/?search=sky`)
      .flush({ results: [{ name: 'Luke Skywalker', height: '172' }] })
    expect(result).toEqual(names('Luke Skywalker'))
    expect(service.charactersLoader$.value).toBe(false)
  })

  it('answers from the saved copy when SWAPI fails', async () => {
    const service = TestBed.inject(MockDataService)
    const http = TestBed.inject(HttpTestingController)
    const result = new Promise<Named[]>((resolve) => service.getPlanets('tat').subscribe(resolve))
    http.expectOne(`${SWAPI_URL}/planets/?search=tat`).error(new ProgressEvent('error'))
    expect(await result).toEqual(names('Tatooine'))
    expect(service.usedSnapshot()).toBe(true)
    expect(service.planetsLoader$.value).toBe(false)
  })

  it('searches the saved copy like SWAPI does', () => {
    const saved = names('Luke Skywalker', 'Anakin Skywalker', 'Leia Organa')
    expect(searchSnapshot(saved, 'SKY')).toEqual(names('Luke Skywalker', 'Anakin Skywalker'))
    expect(searchSnapshot(saved, '')).toEqual(saved)
  })
})
