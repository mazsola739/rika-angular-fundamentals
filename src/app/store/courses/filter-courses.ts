import type { Course } from '../../core/api'

/** The search of the courses page: title or id, case-insensitive. An empty value matches every course. */
export function filterCourses(courses: Course[], value: string): Course[] {
  const wanted = value.trim().toLowerCase()
  if (!wanted) return courses
  return courses.filter(
    (course) => course.title.toLowerCase().includes(wanted) || course.id.toLowerCase() === wanted,
  )
}
