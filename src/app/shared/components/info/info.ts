import { Component, input } from '@angular/core'

/** A centred message with a title, an optional text and whatever the page puts below (a button). */
@Component({
  selector: 'app-info',
  template: `
    <section class="app-info">
      <h2 class="app-info__header">{{ title() }}</h2>
      @if (text()) {
        <p class="app-info__text">{{ text() }}</p>
      }
      <ng-content />
    </section>
  `,
  styles: `
    .app-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 16px;
      text-align: center;

      &__header {
        margin: 0 0 24px;
        font-size: 2rem;
        line-height: 1.25;
        font-weight: 700;
        text-transform: capitalize;
      }

      &__text {
        margin: 0 0 40px;
        max-width: 40rem;
      }
    }
  `,
})
export class Info {
  readonly title = input.required<string>()
  readonly text = input<string>()
}
