import type { Course } from '../../core/api'
import * as CoursesActions from './courses.actions'
import { coursesReducer, initialState } from './courses.reducer'
import { getCourses } from './courses.selectors'

const course = (id: string, title: string): Course => ({
  id,
  title,
  description: `${title}, the course.`,
  creationDate: '2021-10-29',
  duration: 60,
  authors: ['a1'],
})

const zombie = course('1', 'Zombie ipsum')
const cat = course('2', 'Cat Ipsum')
const hodor = course('3', 'Hodor')

const loaded = coursesReducer(
  initialState,
  CoursesActions.requestAllCoursesSuccess({ courses: [zombie, cat, hodor] }),
)
const select = (state: typeof loaded) => getCourses.projector(state)

describe('courses reducer', () => {
  it('loads every course', () => {
    const loading = coursesReducer(initialState, CoursesActions.requestAllCourses())
    expect(loading.isAllCoursesLoading).toBe(true)
    expect(loaded.isAllCoursesLoading).toBe(false)
    expect(loaded.isLoaded).toBe(true)
    expect(select(loaded)).toEqual([zombie, cat, hodor])
  })

  it('lists the search result while searching, every course without a search', () => {
    let state = coursesReducer(loaded, CoursesActions.requestFilteredCourses({ title: ' ipsum ' }))
    state = coursesReducer(
      state,
      CoursesActions.requestFilteredCoursesSuccess({ courses: [zombie, cat] }),
    )
    expect(state.isSearchState).toBe(true)
    expect(state.searchValue).toBe('ipsum')
    expect(select(state)).toEqual([zombie, cat])

    state = coursesReducer(state, CoursesActions.requestFilteredCourses({ title: '' }))
    expect(state.isSearchState).toBe(false)
    expect(select(state)).toEqual([zombie, cat, hodor])
  })

  it('keeps the search result up to date when a course changes', () => {
    let state = coursesReducer(loaded, CoursesActions.requestFilteredCourses({ title: 'ipsum' }))
    state = coursesReducer(
      state,
      CoursesActions.requestFilteredCoursesSuccess({ courses: [zombie, cat] }),
    )
    state = coursesReducer(
      state,
      CoursesActions.requestEditCourseSuccess({ course: { ...cat, title: 'Cat' } }),
    )
    expect(select(state).map((item) => item.title)).toEqual(['Zombie ipsum'])

    state = coursesReducer(
      state,
      CoursesActions.requestCreateCourseSuccess({ course: course('4', 'Unicorn ipsum') }),
    )
    expect(select(state).map((item) => item.title)).toEqual(['Zombie ipsum', 'Unicorn ipsum'])
    expect(state.allCourses).toHaveLength(4)
  })

  it('keeps an error message until it is hidden', () => {
    let state = coursesReducer(
      loaded,
      CoursesActions.requestSingleCourseFail({ error: 'Course 9 was not found.' }),
    )
    expect(state.errorMessage).toBe('Course 9 was not found.')
    state = coursesReducer(state, CoursesActions.clearError())
    expect(state.errorMessage).toBeNull()
  })

  it('never shows another course while one is loading', () => {
    let state = coursesReducer(loaded, CoursesActions.requestSingleCourseSuccess({ course: cat }))
    state = coursesReducer(state, CoursesActions.requestSingleCourse({ id: '3' }))
    expect(state.course).toBeNull()
    expect(state.isSingleCourseLoading).toBe(true)
  })

  it('marks a save in progress', () => {
    const state = coursesReducer(loaded, CoursesActions.requestDeleteCourse({ id: '1' }))
    expect(state.isSaving).toBe(true)
    expect(coursesReducer(state, CoursesActions.requestDeleteCourseSuccess()).isSaving).toBe(false)
  })
})
