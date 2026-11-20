import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Info } from '../../shared/components/info/info'

@Component({
  selector: 'app-not-found',
  imports: [Info, RouterLink],
  template: `
    <h1 class="visually-hidden">Page not found</h1>
    <app-info title="Page not found" text="There is no page at this address.">
      <a routerLink="/courses">Back to the courses</a>
    </app-info>
  `,
})
export default class NotFound {}
