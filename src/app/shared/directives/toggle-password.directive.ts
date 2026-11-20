import { Directive, signal } from '@angular/core'

/**
 * Shows or hides the password of an input. exportAs gives the template the directive itself:
 * `<input appTogglePassword #password="togglePassword">`, then `password.toggle()` and
 * `password.visible()` for the eye button next to it.
 */
@Directive({
  selector: 'input[appTogglePassword]',
  exportAs: 'togglePassword',
  host: { '[type]': 'visible() ? "text" : "password"' },
})
export class TogglePasswordDirective {
  private readonly visible$$ = signal(false)
  readonly visible = this.visible$$.asReadonly()

  toggle(): void {
    this.visible$$.update((visible) => !visible)
  }
}
