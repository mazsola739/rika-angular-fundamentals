import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { provideIcons } from '../../../core/icons'
import { CourseCard, type CourseCardData } from './course-card'

const course: CourseCardData = {
  id: 'c1',
  title: 'Cat Ipsum',
  description: 'Cats, all day long.',
  creationDate: '2021-10-29',
  duration: 99,
  authors: ['Batman', 'Superman'],
}

@Component({
  imports: [CourseCard],
  template: `
    <app-course-card [course]="course" [editable]="editable()" (clickOnShow)="shown = $event">
      <button type="button">Projected edit</button>
    </app-course-card>
  `,
})
class Host {
  readonly course = course
  readonly editable = signal(false)
  shown = ''
}

describe('course card', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideIcons()] }))

  it('shows the course with its authors, duration and date', async () => {
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    const text = (fixture.nativeElement as HTMLElement).textContent ?? ''
    expect(text).toContain('Cat Ipsum')
    expect(text).toContain('Cats, all day long.')
    expect(text).toContain('Batman, Superman')
    expect(text).toContain('01:39 hour')
    expect(text).toContain('29.10.2021')
  })

  it('shows the projected buttons only when editable', async () => {
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    const root = fixture.nativeElement as HTMLElement
    expect(root.textContent).not.toContain('Projected edit')

    fixture.componentInstance.editable.set(true)
    await fixture.whenStable()
    expect(root.textContent).toContain('Projected edit')
  })

  it('tells the page which course to show', async () => {
    const fixture = TestBed.createComponent(Host)
    await fixture.whenStable()
    const show = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')].find(
      (button) => button.textContent?.includes('Show course'),
    )
    show?.click()
    expect(fixture.componentInstance.shown).toBe('c1')
  })
})
