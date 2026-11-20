import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { RouterTestingHarness } from '@angular/router/testing'
import { provideIcons } from '../../core/icons'
import About from '../about/about'
import TaskSheet from './task-sheet'
import { COURSE_MODULES } from './task-sheets'

async function open(url: string) {
  TestBed.configureTestingModule({
    // pdf.js does not run in the test DOM: the viewer stays a placeholder.
    deferBlockBehavior: DeferBlockBehavior.Manual,
    providers: [
      provideIcons(),
      provideRouter(
        [
          { path: 'tasks/:sheet', component: TaskSheet },
          { path: 'about', component: About },
        ],
        withComponentInputBinding(),
      ),
    ],
  })
  const harness = await RouterTestingHarness.create()
  await harness.navigateByUrl(url)
  return harness
}

describe('task sheets', () => {
  it('lists a sheet for every module on the About page, opening inside the app', async () => {
    const harness = await open('/about')
    const links = [
      ...(harness.routeNativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('td a'),
    ]
    const sheetLinks = links.filter((link) => link.getAttribute('href')?.startsWith('/tasks/'))
    expect(sheetLinks).toHaveLength(COURSE_MODULES.flatMap((item) => item.sheets).length)
    expect(sheetLinks.every((link) => !link.target)).toBe(true)
  })

  it('opens the links that leave the app in a new tab', async () => {
    const harness = await open('/about')
    const github = [...(harness.routeNativeElement as HTMLElement).querySelectorAll('a')].find(
      (link) => link.textContent?.includes('Code on GitHub'),
    )
    expect(github?.target).toBe('_blank')
    expect(github?.rel).toBe('noopener noreferrer')
    expect(github?.textContent).toContain('(opens in a new tab)')
  })

  it('shows a sheet with its title, its PDF and the other sheets of the module', async () => {
    const harness = await open('/tasks/module-2-components')
    const page = harness.routeNativeElement as HTMLElement
    expect(page.querySelector('h1')?.textContent).toContain(
      'Module 2: Components and modules – Components',
    )
    const pdf = [...page.querySelectorAll('a')].find((link) =>
      link.textContent?.includes('Open the PDF'),
    )
    expect(pdf?.getAttribute('href')).toBe('course-tasks/module-2-components.pdf')
    expect(page.querySelector('[aria-current="page"]')?.textContent).toBe('Components')
    expect(page.textContent).toContain('Loading the task sheet…')

    const [viewer] = await harness.fixture.getDeferBlocks()
    expect(viewer).toBeDefined()
    await viewer?.render(DeferBlockState.Placeholder)
  })

  it('says so for an unknown sheet', async () => {
    const harness = await open('/tasks/week-9')
    expect(harness.routeNativeElement?.textContent).toContain('Task sheet not found')
  })
})
