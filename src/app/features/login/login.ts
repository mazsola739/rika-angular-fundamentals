import { Component, inject, input, type OnInit, signal } from '@angular/core'
import { FormsModule, type NgForm, type NgModel } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../auth/services/auth.service'
import { errorMessage } from '../../core/api'
import { Button } from '../../shared/components/button/button'
import { EmailValidatorDirective } from '../../shared/directives/email.directive'
import { TogglePasswordDirective } from '../../shared/directives/toggle-password.directive'
import { DEMO_ACCOUNTS } from '../../site'

/** The login page: a template-driven form, with the custom email validator directive. */
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, Button, EmailValidatorDirective, TogglePasswordDirective],
  templateUrl: './login.html',
  styleUrl: '../auth-form.scss',
})
export default class Login implements OnInit {
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)

  /** ?registered=email after a registration: the email is filled in and a note says what happened. */
  readonly registered = input<string>()

  protected readonly email = signal('')
  protected readonly password = signal('')
  protected readonly loading = signal(false)
  protected readonly serverError = signal('')
  protected readonly demoAccounts = DEMO_ACCOUNTS

  ngOnInit(): void {
    const email = this.registered()
    if (email) this.email.set(email)
  }

  /** An error is shown once the form was submitted or the field was left. */
  protected showError(control: NgModel, form: NgForm): boolean {
    return !!control.invalid && (form.submitted || !!control.touched)
  }

  protected fillIn(account: (typeof DEMO_ACCOUNTS)[number]): void {
    this.email.set(account.email)
    this.password.set(account.password)
    this.serverError.set('')
  }

  protected submit(form: NgForm): void {
    this.serverError.set('')
    if (form.invalid || this.loading()) return
    this.loading.set(true)
    this.auth.login({ email: this.email().trim(), password: this.password() }).subscribe({
      next: () => void this.router.navigate(['/courses']),
      error: (error: unknown) => {
        this.serverError.set(errorMessage(error))
        this.loading.set(false)
      },
    })
  }
}
