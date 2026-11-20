import { Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../../auth/services/auth.service'
import { BROWSER_API, usesBrowserApi } from '../../../core/api'
import { PORTFOLIO_URL, REPO_URL } from '../../../site'
import { UserStoreService } from '../../../user/services/user-store.service'
import { ExternalLink } from '../external-link/external-link'

@Component({
  selector: 'app-footer',
  imports: [RouterLink, ExternalLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly browserApi = inject(BROWSER_API)
  private readonly auth = inject(AuthService)
  private readonly userStore = inject(UserStoreService)
  private readonly router = inject(Router)

  protected readonly repoUrl = REPO_URL
  protected readonly portfolioUrl = PORTFOLIO_URL
  protected readonly canReset = usesBrowserApi()

  /** Every visitor has their own data in localStorage; this brings the seed data back. */
  protected async resetData(): Promise<void> {
    await this.browserApi.reset()
    this.auth.forgetToken()
    this.userStore.clear()
    await this.router.navigate(['/login'])
  }
}
