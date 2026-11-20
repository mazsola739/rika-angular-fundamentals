import { Component, input, model, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Button } from '../button/button'

/** A template-driven search form: tells the page what to look for when Search is pressed. */
@Component({
  selector: 'app-search',
  imports: [FormsModule, Button],
  template: `
    <form class="app-search" role="search" (ngSubmit)="search.emit(value().trim())">
      <label class="visually-hidden" for="search-input">{{ label() }}</label>
      <input
        id="search-input"
        name="search"
        type="search"
        autocomplete="off"
        [placeholder]="placeholder()"
        [(ngModel)]="value"
      />
      <app-button type="submit" text="Search" iconName="magnifying-glass" />
    </form>
  `,
  styles: `
    .app-search {
      display: flex;
      flex: 1;
      gap: 16px;

      input {
        flex: 1;
        min-width: 0;
        margin: 0;
      }
    }
  `,
})
export class Search {
  readonly placeholder = input('Input text')
  readonly label = input('Search')
  /** The text in the field; the page can set it, e.g. to the last search. */
  readonly value = model('')
  readonly search = output<string>()
}
