import { Injectable, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router'

export const APP_NAME = "Rika's Angular Fundamentals"

/** "Courses · Rika's Angular Fundamentals": every route's title, then the app's name. */
@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title)

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot)
    this.title.setTitle(page ? `${page} · ${APP_NAME}` : APP_NAME)
  }
}
