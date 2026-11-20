import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ExternalLink } from '../../shared/components/external-link/external-link'
import { DEMO_ACCOUNTS, PORTFOLIO_URL, REACT_APP_URL, REPO_URL } from '../../site'
import { COURSE_MODULES } from '../task-sheets/task-sheets'

@Component({
  selector: 'app-about',
  imports: [RouterLink, ExternalLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export default class About {
  protected readonly modules = COURSE_MODULES
  protected readonly demoAccounts = DEMO_ACCOUNTS
  protected readonly repoUrl = REPO_URL
  protected readonly portfolioUrl = PORTFOLIO_URL
  protected readonly reactAppUrl = REACT_APP_URL
}
