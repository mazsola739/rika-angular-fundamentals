import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { catchError, concatMap, exhaustMap, map, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { errorMessage } from '../../core/api'
import { CoursesService } from '../../services/courses.service'
import * as CoursesActions from './courses.actions'
import { getAllCourses } from './courses.selectors'
import { filterCourses } from './filter-courses'

/** Functional effects: the course's CoursesEffects class, as NgRx writes them today. */

export const getAll$ = createEffect(
  (actions$ = inject(Actions), coursesService = inject(CoursesService)) =>
    actions$.pipe(
      ofType(CoursesActions.requestAllCourses),
      switchMap(() =>
        coursesService.getAll().pipe(
          map((courses) => CoursesActions.requestAllCoursesSuccess({ courses })),
          catchError((error) =>
            of(CoursesActions.requestAllCoursesFail({ error: errorMessage(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
)

/** Searches the courses already in the store, so typing does not cost a request. */
export const filteredCourses$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(CoursesActions.requestFilteredCourses),
      withLatestFrom(store.select(getAllCourses)),
      map(([{ title }, courses]) =>
        CoursesActions.requestFilteredCoursesSuccess({ courses: filterCourses(courses, title) }),
      ),
    ),
  { functional: true },
)

export const getSpecificCourse$ = createEffect(
  (actions$ = inject(Actions), coursesService = inject(CoursesService)) =>
    actions$.pipe(
      ofType(CoursesActions.requestSingleCourse),
      switchMap(({ id }) =>
        coursesService.getCourse(id).pipe(
          map((course) => CoursesActions.requestSingleCourseSuccess({ course })),
          catchError((error) =>
            of(CoursesActions.requestSingleCourseFail({ error: errorMessage(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
)

export const deleteCourse$ = createEffect(
  (actions$ = inject(Actions), coursesService = inject(CoursesService)) =>
    actions$.pipe(
      ofType(CoursesActions.requestDeleteCourse),
      concatMap(({ id }) =>
        coursesService.deleteCourse(id).pipe(
          switchMap(() => [
            CoursesActions.requestDeleteCourseSuccess(),
            CoursesActions.requestAllCourses(),
          ]),
          catchError((error) =>
            of(CoursesActions.requestDeleteCourseFail({ error: errorMessage(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
)

export const editCourse$ = createEffect(
  (actions$ = inject(Actions), coursesService = inject(CoursesService)) =>
    actions$.pipe(
      ofType(CoursesActions.requestEditCourse),
      exhaustMap(({ id, course }) =>
        coursesService.editCourse(id, course).pipe(
          map((updated) => CoursesActions.requestEditCourseSuccess({ course: updated })),
          catchError((error) =>
            of(CoursesActions.requestEditCourseFail({ error: errorMessage(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
)

export const createCourse$ = createEffect(
  (actions$ = inject(Actions), coursesService = inject(CoursesService)) =>
    actions$.pipe(
      ofType(CoursesActions.requestCreateCourse),
      exhaustMap(({ course }) =>
        coursesService.createCourse(course).pipe(
          map((created) => CoursesActions.requestCreateCourseSuccess({ course: created })),
          catchError((error) =>
            of(CoursesActions.requestCreateCourseFail({ error: errorMessage(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
)

export const redirectToTheCoursesPage$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(
        CoursesActions.requestCreateCourseSuccess,
        CoursesActions.requestEditCourseSuccess,
        CoursesActions.requestSingleCourseFail,
      ),
      tap(() => void router.navigate(['/courses'])),
    ),
  { functional: true, dispatch: false },
)
