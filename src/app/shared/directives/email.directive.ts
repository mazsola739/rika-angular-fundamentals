import { Directive, forwardRef } from '@angular/core'
import {
  type AbstractControl,
  NG_VALIDATORS,
  type ValidationErrors,
  type Validator,
} from '@angular/forms'

/** Something@something.domain, without spaces: the same rule as the backend's. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** The error key the email check sets, for the error messages. */
export const INVALID_EMAIL = 'invalidEmail'

export function validateEmail(control: AbstractControl): ValidationErrors | null {
  const value = control.value
  if (value === null || value === undefined || value === '') return null // required's job
  return typeof value === 'string' && EMAIL_PATTERN.test(value.trim())
    ? null
    : { [INVALID_EMAIL]: true }
}

/**
 * The custom email validator as a directive. Angular collects NG_VALIDATORS from the element, so the
 * same directive checks the template-driven login form (ngModel) and the reactive registration form
 * (formControlName).
 */
@Directive({
  selector: '[emailValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidatorDirective), multi: true },
  ],
})
export class EmailValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return validateEmail(control)
  }
}
