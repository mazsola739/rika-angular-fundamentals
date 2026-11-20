import { Component } from '@angular/core'

/**
 * A link that leaves the app: `<a appExternalLink href="…">`. It opens in a new tab, so the app and
 * its login stay where they were, and screen readers hear that it does.
 */
@Component({
  selector: 'a[appExternalLink]',
  template: `<ng-content /><span class="visually-hidden"> (opens in a new tab)</span>`,
  host: { target: '_blank', rel: 'noopener noreferrer' },
})
export class ExternalLink {}
