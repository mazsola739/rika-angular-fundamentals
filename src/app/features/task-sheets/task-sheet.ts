import { Component, computed, effect, inject, input } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router, RouterLink } from '@angular/router'
import { APP_NAME } from '../../core/page-title.strategy'
import { Button } from '../../shared/components/button/button'
import { ExternalLink } from '../../shared/components/external-link/external-link'
import { Info } from '../../shared/components/info/info'
import { PdfPages } from './pdf-pages'
import { COURSE_MODULES, findTaskSheet } from './task-sheets'

/** /tasks/:sheet: one of EPAM's task sheets, inside the app. */
@Component({
  selector: 'app-task-sheet',
  imports: [Button, ExternalLink, Info, PdfPages, RouterLink],
  templateUrl: './task-sheet.html',
  styleUrl: './task-sheet.scss',
})
export default class TaskSheet {
  private readonly router = inject(Router)
  private readonly pageTitle = inject(Title)

  /** The :sheet of the route. */
  readonly sheet = input.required<string>()

  protected readonly found = computed(() => findTaskSheet(this.sheet()))
  protected readonly heading = computed(() => {
    const sheet = this.found()
    return sheet ? `Module ${sheet.module}: ${sheet.topic} – ${sheet.label}` : ''
  })
  protected readonly sameModule = computed(
    () => COURSE_MODULES.find((item) => item.module === this.found()?.module)?.sheets ?? [],
  )

  constructor() {
    effect(() => {
      if (this.heading()) this.pageTitle.setTitle(`${this.heading()} · ${APP_NAME}`)
    })
  }

  protected back(): void {
    void this.router.navigate(['/about'])
  }
}
