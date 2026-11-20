import { createReducer, on } from '@ngrx/store'
import type { Course } from '../../core/api'
import * as CoursesActions from './courses.actions'
import { filterCourses } from './filter-courses'

export const coursesFeatureKey = 'courses'

export interface CoursesState {
  allCourses: Course[]
  /** The result of the last search, kept up to date when the courses change. */
  filteredCourses: Course[]
  course: Course | null
  isAllCoursesLoading: boolean
  isSingleCourseLoading: boolean
  isSearchState: boolean
  searchValue: string
  /** Whether allCourses has been loaded at least once (the empty list is shown only after that). */
  isLoaded: boolean
  /** A request is on its way that changes a course (create, edit or delete). */
  isSaving: boolean
  errorMessage: string | null
}

export const initialState: CoursesState = {
  allCourses: [],
  filteredCourses: [],
  course: null,
  isAllCoursesLoading: false,
  isSingleCourseLoading: false,
  isSearchState: false,
  searchValue: '',
  isLoaded: false,
  isSaving: false,
  errorMessage: null,
}

/** After allCourses changed: the search result follows. */
const withCourses = (state: CoursesState, allCourses: Course[]): CoursesState => ({
  ...state,
  allCourses,
  filteredCourses: state.isSearchState ? filterCourses(allCourses, state.searchValue) : [],
})

const failed = (state: CoursesState, { error }: { error: string }): CoursesState => ({
  ...state,
  isAllCoursesLoading: false,
  isSingleCourseLoading: false,
  isSaving: false,
  errorMessage: error,
})

export const coursesReducer = createReducer(
  initialState,

  on(CoursesActions.requestAllCourses, (state) => ({ ...state, isAllCoursesLoading: true })),
  on(CoursesActions.requestAllCoursesSuccess, (state, { courses }) => ({
    ...withCourses(state, courses),
    isAllCoursesLoading: false,
    isLoaded: true,
  })),
  on(CoursesActions.requestAllCoursesFail, failed),

  on(CoursesActions.requestSingleCourse, (state, { id }) => ({
    ...state,
    // Keep the course while it is reloaded, but never show another course in its place.
    course: state.course?.id === id ? state.course : null,
    isSingleCourseLoading: true,
    errorMessage: null,
  })),
  on(CoursesActions.requestSingleCourseSuccess, (state, { course }) => ({
    ...state,
    course,
    isSingleCourseLoading: false,
  })),
  on(CoursesActions.requestSingleCourseFail, failed),

  on(CoursesActions.requestFilteredCourses, (state, { title }) => ({
    ...state,
    searchValue: title.trim(),
    isSearchState: title.trim() !== '',
  })),
  on(CoursesActions.requestFilteredCoursesSuccess, (state, { courses }) => ({
    ...state,
    filteredCourses: courses,
  })),
  on(CoursesActions.requestFilteredCoursesFail, failed),

  on(
    CoursesActions.requestDeleteCourse,
    CoursesActions.requestEditCourse,
    CoursesActions.requestCreateCourse,
    (state) => ({ ...state, isSaving: true, errorMessage: null }),
  ),
  on(CoursesActions.requestDeleteCourseSuccess, (state) => ({ ...state, isSaving: false })),
  on(CoursesActions.requestCreateCourseSuccess, (state, { course }) => ({
    ...withCourses(state, [...state.allCourses, course]),
    course,
    isSaving: false,
  })),
  on(CoursesActions.requestEditCourseSuccess, (state, { course }) => ({
    ...withCourses(
      state,
      state.allCourses.map((item) => (item.id === course.id ? course : item)),
    ),
    course,
    isSaving: false,
  })),
  on(
    CoursesActions.requestDeleteCourseFail,
    CoursesActions.requestEditCourseFail,
    CoursesActions.requestCreateCourseFail,
    failed,
  ),

  on(CoursesActions.clearError, (state) => ({ ...state, errorMessage: null })),
)
