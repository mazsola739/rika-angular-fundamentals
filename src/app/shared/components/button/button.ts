import { Component, computed, input } from '@angular/core'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core'

/** Regular icons (the eye of the password field); every other icon is a solid one. */
const REGULAR: IconName[] = ['eye', 'eye-slash']

/**
 * The app's button: text, an icon (Font Awesome name), or both. An icon-only button needs a label
 * for screen readers.
 */
@Component({
  selector: 'app-button',
  imports: [FaIconComponent],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: { '[class.wide]': 'wide()' },
})
export class Button {
  readonly text = input<string>()
  readonly iconName = input<IconName>()
  readonly type = input<'button' | 'submit'>('button')
  readonly disabled = input(false)
  /** The accessible name of an icon-only button. */
  readonly label = input<string>()
  /** Primary is the blue button of the design; quiet is an icon on the card, without a background. */
  readonly variant = input<'primary' | 'quiet'>('primary')
  readonly wide = input(false)
  /** A smaller quiet button, for the icons of a list. */
  readonly small = input(false)

  protected readonly icon = computed((): [IconPrefix, IconName] | null => {
    const name = this.iconName()
    if (!name) return null
    return [REGULAR.includes(name) ? 'far' : 'fas', name]
  })
}
