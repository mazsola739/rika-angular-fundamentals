import { Component, input, output } from '@angular/core'
import { Button } from '../../../shared/components/button/button'
import { CourseCard, type CourseCardData } from '../../../shared/components/course-card/course-card'

/** The list of course cards. It only tells the page what was clicked; the page decides what happens. */
@Component({
  selector: 'app-courses-list',
  imports: [CourseCard, Button],
  template: `
    <ul class="courses-list">
      @for (course of courses(); track course.id) {
        <li>
          <app-course-card
            [course]="course"
            [editable]="editable()"
            (clickOnShow)="showCourse.emit($event)"
          >
            <app-button
              variant="quiet"
              iconName="trash-can"
              [label]="'Delete ' + course.title"
              (click)="deleteCourse.emit(course.id)"
            />
            <app-button
              variant="quiet"
              iconName="pen"
              [label]="'Edit ' + course.title"
              (click)="editCourse.emit(course.id)"
            />
          </app-course-card>
        </li>
      }
    </ul>
  `,
  styles: `
    .courses-list {
      display: grid;
      gap: 32px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
  `,
})
export class CoursesList {
  readonly courses = input.required<CourseCardData[]>()
  readonly editable = input(false)
  readonly showCourse = output<string>()
  readonly editCourse = output<string>()
  readonly deleteCourse = output<string>()
}
