import { Component, effect, inject, untracked } from '@angular/core'
import { Router, RouterLink, RouterOutlet } from '@angular/router'
import { AuthService } from './auth/services/auth.service'
import { Button } from './shared/components/button/button'
import { Footer } from './shared/components/footer/footer'
import { Header } from './shared/components/header/header'
import { UserStoreService } from './user/services/user-store.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Header, Footer, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(AuthService)
  protected readonly userStore = inject(UserStoreService)
  private readonly router = inject(Router)

  constructor() {
    // A login, or a reload with a token: fetch who it is (name for the header, role for the admin parts).
    effect(() => {
      if (!this.auth.isAuthorized()) return
      untracked(() => this.userStore.getUser().subscribe({ error: () => undefined }))
    })
  }

  protected logout(): void {
    this.auth.logout().subscribe(() => {
      this.userStore.clear()
      void this.router.navigate(['/login'])
    })
  }
}
