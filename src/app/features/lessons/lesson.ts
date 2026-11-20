import { httpResource } from '@angular/common/http'
import { Component, computed, effect, inject, input, ViewEncapsulation } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router, RouterLink } from '@angular/router'
import { APP_NAME } from '../../core/page-title.strategy'
import { Button } from '../../shared/components/button/button'
import { Info } from '../../shared/components/info/info'
import { COURSE_MODULES } from '../task-sheets/task-sheets'
import { findLesson, LESSONS, lessonsOf } from './lessons'

/**
 * /lessons/:slug: one lesson of the course material, inside the app. The lesson is an HTML file
 * (course-lessons/); Angular's sanitizer checks it before it goes into the page.
 */
@Component({
  selector: 'app-lesson',
  imports: [Button, Info, RouterLink],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss',
  // The lesson's HTML comes from a file, so its styles cannot be scoped by Angular: they are
  // global, under .lesson-body.
  encapsulation: ViewEncapsulation.None,
})
export default class LessonPage {
  private readonly router = inject(Router)
  private readonly pageTitle = inject(Title)

  /** The :slug of the route. */
  readonly slug = input.required<string>()

  protected readonly lesson = computed(() => findLesson(this.slug()))
  protected readonly topic = computed(
    () => COURSE_MODULES.find((item) => item.module === this.lesson()?.module)?.topic ?? '',
  )
  protected readonly moduleLessons = computed(() => lessonsOf(this.lesson()?.module ?? 0))
  protected readonly number = computed(
    () => this.moduleLessons().findIndex((lesson) => lesson.slug === this.slug()) + 1,
  )
  /** The lessons before and after this one, across the modules too. */
  protected readonly previous = computed(() => LESSONS[this.indexInCourse() - 1])
  protected readonly next = computed(() => {
    const index = this.indexInCourse()
    return index >= 0 ? LESSONS[index + 1] : undefined
  })

  protected readonly content = httpResource.text(() => {
    const lesson = this.lesson()
    return lesson ? `course-lessons/${lesson.slug}.html` : undefined
  })

  constructor() {
    effect(() => {
      const lesson = this.lesson()
      if (lesson) this.pageTitle.setTitle(`${lesson.title} · ${APP_NAME}`)
    })
  }

  protected back(): void {
    void this.router.navigate(['/about'])
  }

  private indexInCourse(): number {
    return LESSONS.findIndex((lesson) => lesson.slug === this.slug())
  }
}
