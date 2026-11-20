/**
 * The lessons of EPAM's Angular Fundamentals course material (1.1.0), module by module. Each one
 * is an HTML file in course-lessons/, made from the course's document; the build copies them next
 * to the app and /lessons/:slug shows them.
 */

export type Lesson = { module: number; slug: string; title: string }

export const LESSONS: Lesson[] = [
  { module: 1, slug: 'module-1-quick-overview-of-rxjs', title: 'Quick overview of RxJS' },
  { module: 1, slug: 'module-1-observables', title: 'Observables' },
  { module: 1, slug: 'module-1-subjects', title: 'Subjects' },
  { module: 1, slug: 'module-1-operators', title: 'Operators' },
  { module: 1, slug: 'module-1-rxjs-in-angular', title: 'RxJS in Angular' },
  { module: 2, slug: 'module-2-what-is-angular', title: 'What is Angular?' },
  { module: 2, slug: 'module-2-angular-architecture', title: 'Angular architecture' },
  { module: 2, slug: 'module-2-project-setup-and-first-app', title: 'Project Setup and First App' },
  {
    module: 2,
    slug: 'module-2-javascript-modules-vs-ngmodules',
    title: 'JavaScript modules vs. NgModules',
  },
  { module: 2, slug: 'module-2-ngmodules-introduction', title: 'NgModules Introduction' },
  { module: 2, slug: 'module-2-types-of-feature-modules', title: 'Types of Feature Modules' },
  { module: 2, slug: 'module-2-introduction-to-components', title: 'Introduction to Components' },
  { module: 2, slug: 'module-2-create-component', title: 'Create Component' },
  {
    module: 2,
    slug: 'module-2-sharing-data-between-child-and-parent-components',
    title: 'Sharing data between child and parent components',
  },
  { module: 2, slug: 'module-2-lifecycle-hooks', title: 'Lifecycle hooks' },
  { module: 2, slug: 'module-2-component-template', title: 'Component Template' },
  {
    module: 2,
    slug: 'module-2-working-with-component-styles',
    title: 'Working with Component Styles',
  },
  { module: 2, slug: 'module-2-view-encapsulation', title: 'View encapsulation' },
  { module: 2, slug: 'module-2-introduction-to-databinding', title: 'Introduction to Databinding' },
  { module: 2, slug: 'module-2-text-interpolation', title: 'Text interpolation' },
  { module: 2, slug: 'module-2-property-binding', title: 'Property binding' },
  { module: 2, slug: 'module-2-event-binding', title: 'Event binding' },
  { module: 2, slug: 'module-2-two-way-binding', title: 'Two-way binding' },
  {
    module: 2,
    slug: 'module-2-attribute-class-and-style-bindings',
    title: 'Attribute, class, and style bindings',
  },
  {
    module: 3,
    slug: 'module-3-introduction-to-directives-in-angular',
    title: 'Introduction to directives in Angular',
  },
  { module: 3, slug: 'module-3-ngmodel-directive', title: 'NgModel directive' },
  {
    module: 3,
    slug: 'module-3-creating-a-structural-directive',
    title: 'Creating a structural directive',
  },
  {
    module: 3,
    slug: 'module-3-building-an-attribute-directive',
    title: 'Building an attribute directive',
  },
  {
    module: 3,
    slug: 'module-3-beneficial-applications-of-structural-directives',
    title: 'Beneficial applications of structural directives',
  },
  {
    module: 3,
    slug: 'module-3-introduction-to-forms-in-angular',
    title: 'Introduction to forms in Angular',
  },
  {
    module: 3,
    slug: 'module-3-common-form-foundation-classes',
    title: 'Common form foundation classes',
  },
  { module: 3, slug: 'module-3-form-validation', title: 'Form validation' },
  {
    module: 3,
    slug: 'module-3-data-flow-in-template-driven-forms',
    title: 'Data flow in template-driven forms',
  },
  {
    module: 3,
    slug: 'module-3-template-driven-validating-input-in-template-driven-forms',
    title: 'Template-driven: Validating input in template-driven forms',
  },
  { module: 3, slug: 'module-3-data-flow-in-reactive-forms', title: 'Data flow in reactive forms' },
  {
    module: 3,
    slug: 'module-3-reactive-adding-a-basic-form-control',
    title: 'Reactive: Adding a basic form control',
  },
  {
    module: 3,
    slug: 'module-3-reactive-grouping-form-controls',
    title: 'Reactive: Grouping form controls',
  },
  {
    module: 3,
    slug: 'module-3-reactive-using-the-formbuilder-service-to-generate-controls',
    title: 'Reactive: Using the FormBuilder service to generate controls',
  },
  {
    module: 3,
    slug: 'module-3-reactive-validating-input-in-reactive-forms',
    title: 'Reactive: Validating input in reactive forms',
  },
  { module: 3, slug: 'module-3-custom-validators', title: 'Custom validators' },
  { module: 3, slug: 'module-3-control-status-css-classes', title: 'Control status CSS classes' },
  { module: 3, slug: 'module-3-forms-demo', title: 'Forms Demo' },
  {
    module: 3,
    slug: 'module-3-reactive-creating-a-custom-formcontrol',
    title: 'Reactive: Creating a custom FormControl',
  },
  { module: 3, slug: 'module-3-advanced-articles', title: 'Advanced articles' },
  {
    module: 3,
    slug: 'module-3-intro-transforming-data-using-pipes',
    title: 'Intro: Transforming Data Using Pipes',
  },
  {
    module: 3,
    slug: 'module-3-transforming-data-with-parameters-and-chained-pipes',
    title: 'Transforming data with parameters and chained pipes',
  },
  {
    module: 3,
    slug: 'module-3-creating-pipes-for-custom-data-transformations',
    title: 'Creating pipes for custom data transformations',
  },
  { module: 3, slug: 'module-3-pure-and-impure-pipes', title: 'Pure and impure pipes' },
  {
    module: 4,
    slug: 'module-4-introduction-to-angular-services',
    title: 'Introduction To Angular Services',
  },
  { module: 4, slug: 'module-4-dependency-injection', title: 'Dependency injection' },
  { module: 4, slug: 'module-4-dependency-providers', title: 'Dependency providers' },
  {
    module: 4,
    slug: 'module-4-communicating-with-backend-services-using-http',
    title: 'Communicating with backend services using HTTP',
  },
  { module: 4, slug: 'module-4-advanced-information', title: 'Advanced information' },
  { module: 4, slug: 'module-4-angular-routing', title: 'Angular Routing' },
  { module: 4, slug: 'module-4-route-guards', title: 'Route guards' },
  { module: 4, slug: 'module-4-advanced-articles', title: 'Advanced articles' },
  { module: 5, slug: 'module-5-what-is-application-store', title: 'What is Application Store?' },
  { module: 5, slug: 'module-5-overview', title: 'Overview' },
  { module: 5, slug: 'module-5-actions', title: 'Actions' },
  { module: 5, slug: 'module-5-reducers', title: 'Reducers' },
  { module: 5, slug: 'module-5-selectors', title: 'Selectors' },
  { module: 5, slug: 'module-5-meta-reducers', title: 'Meta-reducers' },
  { module: 5, slug: 'module-5-effects', title: 'Effects' },
  { module: 5, slug: 'module-5-ngrx-facades', title: 'NgRx + Facades' },
]

export const findLesson = (slug: string): Lesson | undefined =>
  LESSONS.find((lesson) => lesson.slug === slug)

export const lessonsOf = (module: number): Lesson[] =>
  LESSONS.filter((lesson) => lesson.module === module)
