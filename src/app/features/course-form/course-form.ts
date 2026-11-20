import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import {
  type AbstractControl,
  type FormControl,
  type FormGroupDirective,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { map, startWith } from 'rxjs'
import type { CourseInput } from '../../core/api'
import { Button } from '../../shared/components/button/button'
import { DurationPipe } from '../../shared/pipes/duration.pipe'
import { AuthorsStateFacade } from '../../store/authors/authors.store'
import { CoursesStateFacade } from '../../store/courses/courses.facade'

/** Latin letters and numbers, words separated by single spaces: "Tony Stark", "R2D2". */
export const AUTHOR_NAME_PATTERN = /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/

/** A course needs at least one author. */
const atLeastOne = (control: AbstractControl): ValidationErrors | null =>
  Array.isArray(control.value) && control.value.length > 0 ? null : { required: true }

/** A whole number of minutes. */
const wholeNumber = (control: AbstractControl): ValidationErrors | null =>
  control.value === null || Number.isInteger(control.value) ? null : { wholeNumber: true }

/**
 * Create and edit a course: a smart component with no inputs or outputs of its own (only the
 * route's :id), so the form's logic lives in one place. The course's authors are a FormArray, the
 * author being created is the newAuthor FormGroup.
 */
@Component({
  selector: 'app-course-form',
  imports: [ReactiveFormsModule, Button, DurationPipe],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export default class CourseForm {
  private readonly fb = inject(NonNullableFormBuilder)
  private readonly router = inject(Router)
  protected readonly courses = inject(CoursesStateFacade)
  protected readonly authors = inject(AuthorsStateFacade)

  /** The :id of /courses/edit/:id; none when a course is created. */
  readonly id = input<string>()
  protected readonly isEdit = computed(() => !!this.id())

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(2)]],
    duration: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
      wholeNumber,
    ]),
    authors: this.fb.array<FormControl<string>>([], atLeastOne),
    newAuthor: this.fb.group({
      author: ['', [Validators.minLength(2), Validators.pattern(AUTHOR_NAME_PATTERN)]],
    }),
  })

  /** The ids in the authors FormArray, as a signal, so the two author lists follow it. */
  private readonly courseAuthorIds = toSignal(
    this.form.controls.authors.valueChanges.pipe(
      startWith(this.form.controls.authors.value),
      map(() => this.form.controls.authors.getRawValue()),
    ),
    { initialValue: [] as string[] },
  )
  protected readonly courseAuthors = computed(() => {
    const byId = new Map(this.authors.authors().map((author) => [author.id, author]))
    return this.courseAuthorIds().flatMap((id) => byId.get(id) ?? [])
  })
  protected readonly availableAuthors = computed(() => {
    const chosen = new Set(this.courseAuthorIds())
    return this.authors.authors().filter((author) => !chosen.has(author.id))
  })

  /** The name of the author being created, until the backend has answered. */
  private readonly creatingAuthor = signal<string | null>(null)
  /** The id of the course the form was filled with (edit). */
  private readonly filledFrom = signal<string | null>(null)
  /** Edit: the form is shown once the course is in it. */
  protected readonly ready = computed(() => !this.isEdit() || this.filledFrom() === this.id())

  constructor() {
    this.courses.clearError()
    this.authors.getAllAuthors()

    // Edit: load the course, then fill the form once it is here.
    effect(() => {
      const id = this.id()
      if (id) untracked(() => this.courses.getSingleCourse(id))
    })
    effect(() => {
      const course = this.courses.course()
      if (!course || course.id !== this.id() || untracked(this.filledFrom) === course.id) return
      untracked(() => {
        this.form.patchValue({
          title: course.title,
          description: course.description,
          duration: course.duration,
        })
        const authors = this.form.controls.authors
        authors.clear()
        for (const id of course.authors) authors.push(this.fb.control(id))
        this.filledFrom.set(course.id)
      })
    })

    // A new author was created: the field is emptied (on an error the name stays to be fixed).
    effect(() => {
      if (this.authors.isCreating() || this.creatingAuthor() === null) return
      const failed = this.authors.errorMessage() !== null
      untracked(() => {
        if (!failed) this.form.controls.newAuthor.reset()
        this.creatingAuthor.set(null)
      })
    })
  }

  protected showError(control: AbstractControl, form: FormGroupDirective): boolean {
    return control.invalid && (form.submitted || control.touched)
  }

  protected addAuthor(id: string): void {
    this.form.controls.authors.push(this.fb.control(id))
    this.form.controls.authors.markAsTouched()
  }

  protected removeAuthor(index: number): void {
    this.form.controls.authors.removeAt(index)
    this.form.controls.authors.markAsTouched()
  }

  protected createAuthor(): void {
    const control = this.form.controls.newAuthor.controls.author
    control.markAsTouched()
    const name = control.value.trim()
    if (!name || control.invalid || this.authors.isCreating()) return
    this.creatingAuthor.set(name)
    this.authors.createAuthor(name)
  }

  protected cancel(): void {
    void this.router.navigate(['/courses'])
  }

  protected submit(): void {
    const { title, description, duration, authors } = this.form.controls
    if (title.invalid || description.invalid || duration.invalid || authors.invalid) return
    if (this.courses.isSaving()) return
    const body: CourseInput = {
      title: title.value.trim(),
      description: description.value.trim(),
      duration: Number(duration.value),
      authors: authors.getRawValue(),
    }
    const id = this.id()
    if (id) this.courses.editCourse(body, id)
    else this.courses.createCourse(body)
  }
}
