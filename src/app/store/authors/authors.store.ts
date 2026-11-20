import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props,
  Store,
} from '@ngrx/store'
import { catchError, concatMap, map, of, switchMap } from 'rxjs'
import { type Author, errorMessage } from '../../core/api'
import { CoursesService } from '../../services/courses.service'

/**
 * The authors, for the course cards and the course form. The course kept them in a service; here
 * they are a second store feature, written the short way NgRx allows today (an action group and
 * createFeature) next to the courses feature that follows the course's task to the letter.
 */

export const AuthorsActions = createActionGroup({
  source: 'Authors',
  events: {
    'Request All Authors': emptyProps(),
    'Request All Authors Success': props<{ authors: Author[] }>(),
    'Request All Authors Fail': props<{ error: string }>(),
    'Request Create Author': props<{ name: string }>(),
    'Request Create Author Success': props<{ author: Author }>(),
    'Request Create Author Fail': props<{ error: string }>(),
  },
})

export interface AuthorsState {
  authors: Author[]
  isLoading: boolean
  isCreating: boolean
  errorMessage: string | null
}

const initialState: AuthorsState = {
  authors: [],
  isLoading: false,
  isCreating: false,
  errorMessage: null,
}

export const authorsFeature = createFeature({
  name: 'authors',
  reducer: createReducer(
    initialState,
    on(AuthorsActions.requestAllAuthors, (state) => ({ ...state, isLoading: true })),
    on(AuthorsActions.requestAllAuthorsSuccess, (state, { authors }) => ({
      ...state,
      authors,
      isLoading: false,
    })),
    on(AuthorsActions.requestAllAuthorsFail, (state, { error }) => ({
      ...state,
      isLoading: false,
      errorMessage: error,
    })),
    on(AuthorsActions.requestCreateAuthor, (state) => ({
      ...state,
      isCreating: true,
      errorMessage: null,
    })),
    on(AuthorsActions.requestCreateAuthorSuccess, (state, { author }) => ({
      ...state,
      authors: [...state.authors, author],
      isCreating: false,
    })),
    on(AuthorsActions.requestCreateAuthorFail, (state, { error }) => ({
      ...state,
      isCreating: false,
      errorMessage: error,
    })),
  ),
})

export const loadAuthors$ = createEffect(
  (actions$ = inject(Actions), coursesService = inject(CoursesService)) =>
    actions$.pipe(
      ofType(AuthorsActions.requestAllAuthors),
      switchMap(() =>
        coursesService.getAllAuthors().pipe(
          map((authors) => AuthorsActions.requestAllAuthorsSuccess({ authors })),
          catchError((error) =>
            of(AuthorsActions.requestAllAuthorsFail({ error: errorMessage(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
)

export const createAuthor$ = createEffect(
  (actions$ = inject(Actions), coursesService = inject(CoursesService)) =>
    actions$.pipe(
      ofType(AuthorsActions.requestCreateAuthor),
      concatMap(({ name }) =>
        coursesService.createAuthor(name).pipe(
          map((author) => AuthorsActions.requestCreateAuthorSuccess({ author })),
          catchError((error) =>
            of(AuthorsActions.requestCreateAuthorFail({ error: errorMessage(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
)

@Injectable({ providedIn: 'root' })
export class AuthorsStateFacade {
  private readonly store = inject(Store)

  readonly authors = this.store.selectSignal(authorsFeature.selectAuthors)
  readonly isCreating = this.store.selectSignal(authorsFeature.selectIsCreating)
  readonly errorMessage = this.store.selectSignal(authorsFeature.selectErrorMessage)

  getAllAuthors(): void {
    this.store.dispatch(AuthorsActions.requestAllAuthors())
  }

  createAuthor(name: string): void {
    this.store.dispatch(AuthorsActions.requestCreateAuthor({ name }))
  }
}
