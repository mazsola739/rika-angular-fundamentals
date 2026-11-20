import type { Author, Course } from '../../core/api'
import type { CourseCardData } from '../../shared/components/course-card/course-card'

/** The names of a course's authors, in the course's order; unknown ids are left out. */
export function authorNames(ids: string[], authors: Author[]): string[] {
  const byId = new Map(authors.map((author) => [author.id, author.name]))
  return ids.flatMap((id) => {
    const name = byId.get(id)
    return name ? [name] : []
  })
}

/** Courses as the cards show them: with the authors' names instead of their ids. */
export const toCourseCards = (courses: Course[], authors: Author[]): CourseCardData[] =>
  courses.map((course) => ({ ...course, authors: authorNames(course.authors, authors) }))
