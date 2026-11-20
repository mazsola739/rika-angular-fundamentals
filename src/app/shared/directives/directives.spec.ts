import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { UserStoreService } from '../../user/services/user-store.service'
import { EmailValidatorDirective, INVALID_EMAIL, validateEmail } from './email.directive'
import { IfAdminDirective } from './if-admin.directive'
import { TogglePasswordDirective } from './toggle-password.directive'

describe('email validator', () => {
  it.each(['admin@email.com', ' user@mail.co.uk ', 'a.b+c@d.io'])('accepts %s', (email) => {
    expect(validateEmail(new FormControl(email))).toBeNull()
  })

  it.each(['admin', 'admin@', 'admin@email', 'ad min@email.com', 'admin@email.c'])(
    'rejects %s',
    (email) => {
      expect(validateEmail(new FormControl(email))).toEqual({ [INVALID_EMAIL]: true })
    },
  )

  it('leaves an empty field to the required validator', () => {
    expect(validateEmail(new FormControl(''))).toBeNull()
  })

  @Component({
    imports: [FormsModule, ReactiveFormsModule, EmailValidatorDirective],
    template: `
      <input name="email" emailValidator [(ngModel)]="email" />
      <input emailValidator [formControl]="control" />
    `,
  })
  class Host {
    readonly email = signal('nope')
    readonly control = new FormControl('nope@')
  }

  it('checks a template-driven and a reactive field alike', async () => {
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    const model = fixture.debugElement.query(By.directive(NgModel)).injector.get(NgModel)
    expect(model.hasError(INVALID_EMAIL)).toBe(true)
    expect(fixture.componentInstance.control.hasError(INVALID_EMAIL)).toBe(true)

    fixture.componentInstance.control.setValue('yes@email.com')
    expect(fixture.componentInstance.control.valid).toBe(true)
  })
})

describe('toggle password directive', () => {
  @Component({
    imports: [TogglePasswordDirective],
    template: `
      <input appTogglePassword #password="togglePassword" />
      <button type="button" (click)="password.toggle()">
        {{ password.visible() ? 'Hide' : 'Show' }}
      </button>
    `,
  })
  class Host {}

  it('switches the input between password and text, and the template can read it', async () => {
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    const root = fixture.nativeElement as HTMLElement
    const input = root.querySelector('input') as HTMLInputElement
    const toggle = root.querySelector('button') as HTMLButtonElement
    expect(input.type).toBe('password')
    expect(toggle.textContent?.trim()).toBe('Show')

    toggle.click()
    await fixture.whenStable()
    expect(input.type).toBe('text')
    expect(toggle.textContent?.trim()).toBe('Hide')
  })
})

describe('*appIfAdmin', () => {
  @Component({
    imports: [IfAdminDirective],
    template: `<p *appIfAdmin>Admin only</p>`,
  })
  class Host {}

  it('shows its content only to an admin, and follows the user', async () => {
    const isAdmin = signal(false)
    TestBed.configureTestingModule({
      providers: [{ provide: UserStoreService, useValue: { isAdmin } }],
    })
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    const root = fixture.nativeElement as HTMLElement
    expect(root.textContent).not.toContain('Admin only')

    isAdmin.set(true)
    await fixture.whenStable()
    expect(root.textContent).toContain('Admin only')

    isAdmin.set(false)
    await fixture.whenStable()
    expect(root.textContent).not.toContain('Admin only')
  })
})
