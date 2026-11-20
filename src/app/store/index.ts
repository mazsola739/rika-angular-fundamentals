import type { ActionReducerMap } from '@ngrx/store'
import {
  type AuthorsState,
  authorsFeature,
  createAuthor$,
  loadAuthors$,
} from './authors/authors.store'
import * as coursesEffects from './courses/courses.effects'
import { type CoursesState, coursesFeatureKey, coursesReducer } from './courses/courses.reducer'

export interface State {
  [coursesFeatureKey]: CoursesState
  [authorsFeature.name]: AuthorsState
}

export const reducers: ActionReducerMap<State> = {
  [coursesFeatureKey]: coursesReducer,
  [authorsFeature.name]: authorsFeature.reducer,
}

/** Functional effects: provideEffects picks every effect out of these objects. */
export const effects = [coursesEffects, { loadAuthors$, createAuthor$ }]
