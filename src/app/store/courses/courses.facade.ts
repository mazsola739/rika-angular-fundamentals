import { Injectable, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import type { CourseInput } from '../../core/api'
import * as CoursesActions from './courses.actions'
import * as CoursesSelectors from './courses.selectors'

/**
 * The only way the components reach the courses store: they never dispatch or select directly.
 * The course asked for Observables (store.pipe(select(…))); the components of today read signals.
 */
@Injectable({ providedIn: 'root' })
export class CoursesStateFacade {
  private readonly store = inject(Store)

  readonly isAllCoursesLoading = this.store.selectSignal(
    CoursesSelectors.isAllCoursesLoadingSelector,
  )
  readonly isSingleCourseLoading = this.store.selectSignal(
    CoursesSelectors.isSingleCourseLoadingSelector,
  )
  readonly isSearchingState = this.store.selectSignal(CoursesSelectors.isSearchingStateSelector)
  readonly courses = this.store.selectSignal(CoursesSelectors.getCourses)
  readonly allCourses = this.store.selectSignal(CoursesSelectors.getAllCourses)
  readonly course = this.store.selectSignal(CoursesSelectors.getCourse)
  readonly errorMessage = this.store.selectSignal(CoursesSelectors.getErrorMessage)
  readonly searchValue = this.store.selectSignal(CoursesSelectors.getSearchValue)
  readonly isLoaded = this.store.selectSignal(CoursesSelectors.isLoadedSelector)
  readonly isSaving = this.store.selectSignal(CoursesSelectors.isSavingSelector)

  getAllCourses(): void {
    this.store.dispatch(CoursesActions.requestAllCourses())
  }

  getSingleCourse(id: string): void {
    this.store.dispatch(CoursesActions.requestSingleCourse({ id }))
  }

  getFilteredCourses(searchValue: string): void {
    this.store.dispatch(CoursesActions.requestFilteredCourses({ title: searchValue }))
  }

  editCourse(body: CourseInput, id: string): void {
    this.store.dispatch(CoursesActions.requestEditCourse({ id, course: body }))
  }

  createCourse(body: CourseInput): void {
    this.store.dispatch(CoursesActions.requestCreateCourse({ course: body }))
  }

  deleteCourse(id: string): void {
    this.store.dispatch(CoursesActions.requestDeleteCourse({ id }))
  }

  clearError(): void {
    this.store.dispatch(CoursesActions.clearError())
  }
}
