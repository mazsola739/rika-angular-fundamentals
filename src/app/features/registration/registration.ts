import { Component, inject, signal } from '@angular/core'
import {
  type AbstractControl,
  type FormGroupDirective,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../auth/services/auth.service'
import { errorMessage } from '../../core/api'
import { Button } from '../../shared/components/button/button'
import { EmailValidatorDirective, INVALID_EMAIL } from '../../shared/directives/email.directive'
import { TogglePasswordDirective } from '../../shared/directives/toggle-password.directive'

/** The registration page: a reactive form. The email is checked by the same directive as the login. */
@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Button,
    EmailValidatorDirective,
    TogglePasswordDirective,
  ],
  templateUrl: './registration.html',
  styleUrl: '../auth-form.scss',
})
export default class Registration {
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })
  protected readonly loading = signal(false)
  protected readonly serverError = signal('')
  protected readonly invalidEmail = INVALID_EMAIL

  protected showError(control: AbstractControl, form: FormGroupDirective): boolean {
    return control.invalid && (form.submitted || control.touched)
  }

  protected submit(): void {
    this.serverError.set('')
    if (this.form.invalid || this.loading()) return
    const { name, email, password } = this.form.getRawValue()
    this.loading.set(true)
    this.auth.register({ name: name.trim(), email: email.trim(), password }).subscribe({
      next: () =>
        void this.router.navigate(['/login'], { queryParams: { registered: email.trim() } }),
      error: (error: unknown) => {
        this.serverError.set(errorMessage(error))
        this.loading.set(false)
      },
    })
  }
}
