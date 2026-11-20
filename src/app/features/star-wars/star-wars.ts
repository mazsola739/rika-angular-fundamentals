import { AsyncPipe } from '@angular/common'
import { Component, DestroyRef, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  type Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs'
import { Button } from '../../shared/components/button/button'
import { ExternalLink } from '../../shared/components/external-link/external-link'
import { MockDataService, type Named } from './mock-data.service'

/** Characters are searched from this many letters on. */
export const MIN_SEARCH_LENGTH = 3
/** How long the input has to be still before the search starts. */
export const SEARCH_DEBOUNCE = 500

/**
 * Module 1, the RxJS task: a search that waits for 3 letters and for the typing to stop, two requests
 * combined into one list, and a loader fed by two streams. The numbers in the comments are the
 * steps of the task.
 */
@Component({
  selector: 'app-star-wars',
  imports: [AsyncPipe, Button, ExternalLink],
  templateUrl: './star-wars.html',
  styleUrl: './star-wars.scss',
})
export default class StarWars {
  private readonly mockDataService = inject(MockDataService)
  private readonly destroyRef = inject(DestroyRef)

  readonly searchTermByCharacters = new Subject<string>()
  protected readonly searching = signal(false)
  protected readonly charactersResults$: Observable<Named[]>
  protected readonly planetAndCharactersResults$ = signal<Observable<Named[]> | null>(null)
  protected readonly isLoading = signal(false)
  protected readonly usedSnapshot = this.mockDataService.usedSnapshot
  protected readonly minLength = MIN_SEARCH_LENGTH

  constructor() {
    // 1–3. A request per search, only from 3 letters on, and only once the typing stopped.
    this.charactersResults$ = this.searchTermByCharacters.pipe(
      map((term) => term.trim()),
      filter((term) => term.length >= MIN_SEARCH_LENGTH),
      debounceTime(SEARCH_DEBOUNCE),
      distinctUntilChanged(),
      tap(() => this.searching.set(true)),
      // A new search cancels the one still on its way.
      switchMap((term) => this.mockDataService.getCharacters(term)),
      tap(() => this.searching.set(false)),
    )

    // 5. The loader: both requests' loading states combined. takeUntilDestroyed unsubscribes when
    // the page is left (5b), instead of a list of subscriptions and ngOnDestroy.
    combineLatest([
      this.mockDataService.getCharactersLoader(),
      this.mockDataService.getPlanetLoader(),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loaders) => this.isLoading.set(this.areAllValuesTrue(loaders)))
  }

  /** 1.1. Every keystroke goes into the Subject. */
  protected changeCharactersInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value
    this.searchTermByCharacters.next(inputValue)
  }

  /** 4. Characters and planets at once: one list when both requests have answered. */
  protected loadCharactersAndPlanet(): void {
    this.planetAndCharactersResults$.set(
      forkJoin([this.mockDataService.getCharacters(), this.mockDataService.getPlanets()]).pipe(
        map(([characters, planets]) => [...characters, ...planets]),
      ),
    )
  }

  areAllValuesTrue(elements: boolean[]): boolean {
    return elements.every((element) => element)
  }
}
