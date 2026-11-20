import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core'
import { UserStoreService } from '../../user/services/user-store.service'

/**
 * A structural directive: `<button *appIfAdmin>` is in the page only for an admin, and appears or
 * disappears when the logged-in user changes.
 */
@Directive({ selector: '[appIfAdmin]' })
export class IfAdminDirective {
  private readonly template = inject(TemplateRef)
  private readonly container = inject(ViewContainerRef)
  private readonly userStore = inject(UserStoreService)
  private shown = false

  constructor() {
    effect(() => {
      const isAdmin = this.userStore.isAdmin()
      if (isAdmin && !this.shown) this.container.createEmbeddedView(this.template)
      if (!isAdmin && this.shown) this.container.clear()
      this.shown = isAdmin
    })
  }
}
