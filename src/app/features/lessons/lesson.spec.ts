import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { RouterTestingHarness } from '@angular/router/testing'
import { provideIcons } from '../../core/icons'
import About from '../about/about'
import LessonPage from './lesson'
import { LESSONS, lessonsOf } from './lessons'

async function open(url: string) {
  TestBed.configureTestingModule({
    providers: [
      provideIcons(),
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter(
        [
          { path: 'lessons/:slug', component: LessonPage },
          { path: 'about', component: About },
        ],
        withComponentInputBinding(),
      ),
    ],
  })
  const harness = await RouterTestingHarness.create()
  await harness.navigateByUrl(url)
  return { harness, http: TestBed.inject(HttpTestingController) }
}

describe('lessons', () => {
  it('has lessons for all five modules, each with its own address', () => {
    expect([1, 2, 3, 4, 5].map((module) => lessonsOf(module).length)).toEqual([5, 19, 24, 8, 8])
    expect(new Set(LESSONS.map((lesson) => lesson.slug)).size).toBe(LESSONS.length)
  })

  it('lists them on the About page, module by module', async () => {
    const { harness } = await open('/about')
    const page = harness.routeNativeElement as HTMLElement
    expect(page.querySelectorAll('.lessons details')).toHaveLength(5)
    const observables = [...page.querySelectorAll('.lessons a')].find(
      (link) => link.textContent?.trim() === 'Observables',
    )
    expect(observables?.getAttribute('href')).toBe('/lessons/module-1-observables')
  })

  it('shows a lesson from its file, with links to the lessons around it', async () => {
    const { harness, http } = await open('/lessons/module-1-observables')
    const page = harness.routeNativeElement as HTMLElement
    expect(page.querySelector('h1')?.textContent).toBe('Observables')
    expect(page.textContent).toContain('Lesson 2 of 5 in module 1')
    expect(page.textContent).toContain('Loading the lesson…')

    http
      .expectOne('course-lessons/module-1-observables.html')
      .flush(
        '<h2>Pull vs Push context</h2><p>See <a href="https://rxjs.dev" target="_blank" rel="noopener noreferrer">RxJS</a>.</p><pre><code>observable.subscribe()</code></pre>',
      )
    await harness.fixture.whenStable()

    expect(page.querySelector('.lesson-body h2')?.textContent).toBe('Pull vs Push context')
    expect(page.querySelector('.lesson-body pre')?.textContent).toBe('observable.subscribe()')
    const external = page.querySelector<HTMLAnchorElement>('.lesson-body a')
    expect(external?.target).toBe('_blank')
    expect(page.querySelector('[rel="prev"]')?.textContent).toContain('Quick overview of RxJS')
    expect(page.querySelector('[rel="next"]')?.textContent).toContain('Subjects')
  })

  it('goes on to the next module after the last lesson of one', async () => {
    const { harness } = await open('/lessons/module-1-rxjs-in-angular')
    const next = (harness.routeNativeElement as HTMLElement).querySelector('[rel="next"]')
    expect(next?.getAttribute('href')).toBe('/lessons/module-2-what-is-angular')
  })

  it('says so for an unknown lesson', async () => {
    const { harness } = await open('/lessons/module-9-nothing')
    expect(harness.routeNativeElement?.textContent).toContain('Lesson not found')
  })
})
