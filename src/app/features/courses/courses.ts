import { Component, computed, inject, type OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { Button } from '../../shared/components/button/button'
import type { CourseCardData } from '../../shared/components/course-card/course-card'
import { Info } from '../../shared/components/info/info'
import { Modal } from '../../shared/components/modal/modal'
import { Search } from '../../shared/components/search/search'
import { IfAdminDirective } from '../../shared/directives/if-admin.directive'
import { AuthorsStateFacade } from '../../store/authors/authors.store'
import { CoursesStateFacade } from '../../store/courses/courses.facade'
import { UserStoreService } from '../../user/services/user-store.service'
import { toCourseCards } from './course-cards'
import { CoursesList } from './courses-list/courses-list'

/** The courses page: search, the list (or an empty state), and for an admin add, edit and delete. */
@Component({
  selector: 'app-courses',
  imports: [Button, CoursesList, IfAdminDirective, Info, Modal, Search],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export default class Courses implements OnInit {
  protected readonly courses = inject(CoursesStateFacade)
  private readonly authors = inject(AuthorsStateFacade)
  protected readonly userStore = inject(UserStoreService)
  private readonly router = inject(Router)

  protected readonly cards = computed(() =>
    toCourseCards(this.courses.courses(), this.authors.authors()),
  )
  /** The course waiting for "Delete?" to be answered. */
  protected readonly toDelete = signal<CourseCardData | null>(null)

  ngOnInit(): void {
    this.courses.getAllCourses()
    this.authors.getAllAuthors()
  }

  protected search(value: string): void {
    this.courses.getFilteredCourses(value)
  }

  protected showCourse(id: string): void {
    void this.router.navigate(['/courses', id])
  }

  protected editCourse(id: string): void {
    void this.router.navigate(['/courses/edit', id])
  }

  protected addCourse(): void {
    void this.router.navigate(['/courses/add'])
  }

  protected askDelete(id: string): void {
    this.toDelete.set(this.cards().find((course) => course.id === id) ?? null)
  }

  protected confirmDelete(id: string): void {
    this.courses.deleteCourse(id)
    this.toDelete.set(null)
  }
}
