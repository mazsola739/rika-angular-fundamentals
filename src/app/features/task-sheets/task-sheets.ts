/**
 * The five modules of the course and EPAM's task sheets in course-tasks/. The build copies the PDFs
 * next to the app, and every sheet has a page of its own in it: /tasks/module-3-forms-directives-pipes.
 */

export type TaskSheet = {
  /** File name without .pdf, also the address of its page. */
  slug: string
  module: number
  topic: string
  label: string
  /** Where the build put the PDF, relative to the app. */
  url: string
}

export type CourseModule = {
  module: number
  topic: string
  got: string
  /** A page of this app that shows the module's work. */
  page?: { label: string; route: string }
  sheets: TaskSheet[]
}

const courseModule = (
  module: number,
  topic: string,
  got: string,
  sheets: [label: string, slug: string][],
  page?: CourseModule['page'],
): CourseModule => ({
  module,
  topic,
  got,
  page,
  sheets: sheets.map(([label, slug]) => ({
    slug,
    module,
    topic,
    label,
    url: `course-tasks/${slug}.pdf`,
  })),
})

export const COURSE_MODULES: CourseModule[] = [
  courseModule(
    1,
    'RxJS',
    'The Star Wars page: a debounced search, two requests combined, a loader from two streams',
    [['Task', 'module-1-rxjs']],
    { label: 'Open the page', route: '/rxjs' },
  ),
  courseModule(
    2,
    'Components and modules',
    'Header, button, info, course card, course list and course page, with mocked data',
    [
      ['Task', 'module-2-components-task'],
      ['Components', 'module-2-components'],
    ],
  ),
  courseModule(
    3,
    'Forms, directives and pipes',
    'Login (template-driven), registration and the course form (reactive), an email validator directive, a password toggle, the duration and date pipes, search',
    [['Task', 'module-3-forms-directives-pipes']],
  ),
  courseModule(
    4,
    'Routing and services',
    'Lazy routes, login with a token, guards, an interceptor, the services that talk to the backend, the admin role',
    [['Task', 'module-4-router-services']],
  ),
  courseModule(
    5,
    'NgRx',
    'A store for the courses: actions, reducer, selectors, effects and a facade for the components',
    [['Task', 'module-5-ngrx']],
  ),
]

export const findTaskSheet = (slug: string): TaskSheet | undefined =>
  COURSE_MODULES.flatMap((item) => item.sheets).find((sheet) => sheet.slug === slug)
