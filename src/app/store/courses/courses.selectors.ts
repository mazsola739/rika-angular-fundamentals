import { createFeatureSelector, createSelector } from '@ngrx/store'
import { type CoursesState, coursesFeatureKey } from './courses.reducer'

export const selectCoursesState = createFeatureSelector<CoursesState>(coursesFeatureKey)

export const isAllCoursesLoadingSelector = createSelector(
  selectCoursesState,
  (state) => state.isAllCoursesLoading,
)
export const isSearchingStateSelector = createSelector(
  selectCoursesState,
  (state) => state.isSearchState,
)
export const isSingleCourseLoadingSelector = createSelector(
  selectCoursesState,
  (state) => state.isSingleCourseLoading,
)
/** What the courses page lists: the search result while searching, every course otherwise. */
export const getCourses = createSelector(selectCoursesState, (state) =>
  state.isSearchState ? state.filteredCourses : state.allCourses,
)
export const getAllCourses = createSelector(selectCoursesState, (state) => state.allCourses)
export const getCourse = createSelector(selectCoursesState, (state) => state.course)
export const getErrorMessage = createSelector(selectCoursesState, (state) => state.errorMessage)
export const getSearchValue = createSelector(selectCoursesState, (state) => state.searchValue)
export const isLoadedSelector = createSelector(selectCoursesState, (state) => state.isLoaded)
export const isSavingSelector = createSelector(selectCoursesState, (state) => state.isSaving)
