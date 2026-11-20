import { Component, computed, effect, inject, input, untracked } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { APP_NAME } from '../../core/page-title.strategy'
import { Button } from '../../shared/components/button/button'
import { IfAdminDirective } from '../../shared/directives/if-admin.directive'
import { CustomDatePipe } from '../../shared/pipes/custom-date.pipe'
import { DurationPipe } from '../../shared/pipes/duration.pipe'
import { AuthorsStateFacade } from '../../store/authors/authors.store'
import { CoursesStateFacade } from '../../store/courses/courses.facade'
import { authorNames } from '../courses/course-cards'

/** One course with every detail. An unknown id goes back to the list (redirectToTheCoursesPage$). */
@Component({
  selector: 'app-course-info',
  imports: [Button, CustomDatePipe, DurationPipe, IfAdminDirective],
  templateUrl: './course-info.html',
  styleUrl: './course-info.scss',
})
export default class CourseInfo {
  private readonly courses = inject(CoursesStateFacade)
  private readonly authors = inject(AuthorsStateFacade)
  private readonly router = inject(Router)
  private readonly title = inject(Title)

  /** The :id of the route. */
  readonly id = input.required<string>()

  /** The course of this page only: never the one that was open before. */
  protected readonly course = computed(() => {
    const course = this.courses.course()
    return course?.id === this.id() ? course : null
  })
  protected readonly authorNames = computed(() =>
    authorNames(this.course()?.authors ?? [], this.authors.authors()),
  )

  constructor() {
    effect(() => {
      const id = this.id()
      untracked(() => this.courses.getSingleCourse(id))
    })
    this.authors.getAllAuthors()
    effect(() => {
      const course = this.course()
      if (course) this.title.setTitle(`${course.title} · ${APP_NAME}`)
    })
  }

  protected back(): void {
    void this.router.navigate(['/courses'])
  }

  protected edit(): void {
    void this.router.navigate(['/courses/edit', this.id()])
  }
}
