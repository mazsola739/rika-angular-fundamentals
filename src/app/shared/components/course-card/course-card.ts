import { Component, input, output } from '@angular/core'
import { CustomDatePipe } from '../../pipes/custom-date.pipe'
import { DurationPipe } from '../../pipes/duration.pipe'
import { Button } from '../button/button'

/** What a card shows: a course with the names of its authors. */
export type CourseCardData = {
  id: string
  title: string
  description: string
  creationDate: string | Date
  duration: number
  authors: string[]
}

/**
 * One course of the list. Show course is always there; the page decides which other buttons to
 * give it (content projection), and they appear only on an editable card.
 */
@Component({
  selector: 'app-course-card',
  imports: [Button, CustomDatePipe, DurationPipe],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCard {
  readonly course = input.required<CourseCardData>()
  readonly editable = input(false)
  readonly clickOnShow = output<string>()
}
