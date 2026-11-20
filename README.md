# Angular Fundamentals – Courses app

A courses app: log in, browse and search the courses; admins add, edit and delete them. And the
RxJS task of the course: a small Star Wars search.

**Live:** <https://mazsola739.github.io/rika-angular-fundamentals/> · **Portfolio:** <https://mazsola739.github.io/mazsola739/> · **The same app in React:** <https://mazsola739.github.io/rika-react-fundamentals/>

It was my homework for EPAM's **Angular Fundamentals** course in 2021: five modules, from RxJS to
an NgRx store, and from the second module on the same app grew. EPAM gave the task sheets, a
template project and a NestJS backend to run on localhost. My code from the course got lost; what I
still have is a later version of the course material (1.1.0, with an Angular 15 template). So in
2026 I wrote the app again from those task sheets, with today's Angular, and put it on the same
backend I wrote for my
[React Fundamentals app](https://github.com/mazsola739/rika-react-fundamentals), so the whole thing
runs on GitHub Pages.

## Try it

| Account | Email             | Password   | Can                                       |
| ------- | ----------------- | ---------- | ----------------------------------------- |
| Admin   | `admin@email.com` | `admin123` | add, edit and delete courses, add authors |
| Student | `user@email.com`  | `user123`  | browse and search                         |

Or register an account of your own. The data lives in your browser's localStorage, so add, edit and
delete freely: **Reset demo data** in the footer brings back the starting courses.

## The five modules

| Module | Topic                       | What the app got                                                                                                            | Task sheet                                                                                            |
| ------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1      | RxJS                        | The Star Wars page (`/#/rxjs`): `Subject`, `filter`, `debounceTime`, `switchMap`, `forkJoin`, `combineLatest`               | [task](course-tasks/module-1-rxjs.pdf)                                                                |
| 2      | Components and modules      | Header, button, info, course card, course list, course page                                                                 | [task](course-tasks/module-2-components-task.pdf), [components](course-tasks/module-2-components.pdf) |
| 3      | Forms, directives and pipes | Login (template-driven), registration and course form (reactive), email validator directive, password toggle, pipes, search | [task](course-tasks/module-3-forms-directives-pipes.pdf)                                              |
| 4      | Routing and services        | Lazy routes, token login, guards, an interceptor, the API services, the admin role                                          | [task](course-tasks/module-4-router-services.pdf)                                                     |
| 5      | NgRx                        | The courses store: actions, reducer, selectors, effects and a facade, the only way the components reach the store           | [task](course-tasks/module-5-ngrx.pdf)                                                                |

The extra tasks are in too: the password toggle is an attribute directive with `exportAs`, and
`*appIfAdmin` is a structural directive that shows the admin buttons.

The lessons of the course are in the app as well: 64 of them, from Observables to NgRx facades,
listed module by module on the About page, each on a page of its own (`/#/lessons/…`).

## What is different from the course's template

| The course template (version 1.1.0)                                          | 2026                                                                                                                          |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Angular 15, NgModules, `@Input()` / `@Output()`                              | Angular 22: standalone components, `input()`, `output()`, `model()`, zoneless                                                 |
| `*ngIf`, `*ngFor`                                                            | `@if`, `@for`, `@let`                                                                                                         |
| Class guards, `canLoad`, a class interceptor                                 | Functional guards (`canMatch`), functional interceptors                                                                       |
| `BehaviorSubject` pairs in the services (`isAuthorized$$` + `isAuthorized$`) | The same pair as a private signal and its `asReadonly()` view                                                                 |
| NgRx 15, `CoursesEffects` class, facade with Observables                     | NgRx 22: functional effects, a facade with `selectSignal`; authors as a second feature (`createActionGroup`, `createFeature`) |
| Jest                                                                         | Vitest through `ng test`: 79 tests, 19 of them for the backend                                                                |
| EPAM's NestJS backend on `localhost:4000`                                    | My own backend: a Bun server, or the same code in the browser                                                                 |
| Plain passwords in a JSON file                                               | PBKDF2 hashes, expiring tokens                                                                                                |
| Figma screens for the desktop                                                | The Figma look, on phones too, keyboard and screen reader friendly                                                            |
| The course material in one big document                                      | The five task sheets as PDFs, shown inside the app with pdf.js                                                                |

## The backend is mine

The same backend as my React Fundamentals app (the course's backend was the same NestJS app too):
the endpoints and the answers of EPAM's backend, but no framework, only the web platform's
`Request` and `Response`. On GitHub Pages there is no server, so the app's last HTTP interceptor
([`browser-backend.interceptor.ts`](src/app/core/browser-backend.interceptor.ts)) hands the requests
to the backend running in the browser; `HttpClient`, the token interceptor and the services do not
know the difference.

- [`server/api.ts`](server/api.ts): routes, validation, sessions; the whole backend is one
  `fetch(request) → response` function.
- [`server/main.ts`](server/main.ts): that function as a Bun server (`bun run server`,
  <http://localhost:4000>), with the data in `server/data/db.json`.
- [`server/browser.ts`](server/browser.ts): the same function inside the browser, with the data in
  localStorage.
- Passwords are stored as PBKDF2-SHA-256 hashes with a salt per user; a login gets a random 256-bit
  token that expires after a day and ends on logout. Admin routes answer `401` without a login and
  `403` for a student.

| Method   | Path                           | Who       | What                                                             |
| -------- | ------------------------------ | --------- | ---------------------------------------------------------------- |
| `POST`   | `/register`                    | anyone    | `{ name, email, password }`                                      |
| `POST`   | `/login`                       | anyone    | `{ email, password }` → `"Bearer <token>"`                       |
| `DELETE` | `/logout`                      | logged in | the token stops working                                          |
| `GET`    | `/users/me`                    | logged in | the user, with the role                                          |
| `GET`    | `/courses/all`                 | anyone    | every course                                                     |
| `GET`    | `/courses/filter?title=…`      | anyone    | courses whose title, description, creationDate or duration match |
| `GET`    | `/courses/:id`                 | anyone    | one course                                                       |
| `POST`   | `/courses/add`                 | admin     | `{ title, description, duration, authors }`                      |
| `PUT`    | `/courses/:id`                 | admin     | any of those fields                                              |
| `DELETE` | `/courses/:id`                 | admin     | delete a course                                                  |
| `GET`    | `/authors/all`, `/authors/:id` | anyone    | every author, one author                                         |
| `POST`   | `/authors/add`                 | admin     | `{ name }`                                                       |

## Stack

Angular 22 · TypeScript · [NgRx](https://ngrx.io) · RxJS ·
[Angular Font Awesome](https://github.com/FortAwesome/angular-fontawesome) · SCSS ·
[Vitest](https://vitest.dev) · [Biome](https://biomejs.dev) · [Bun](https://bun.sh)

## Run locally

Needs [Bun](https://bun.sh) and Node 22.22 or later (the Angular CLI runs on Node).

```bash
bun install
bun run dev
```

That runs the app on <http://localhost:4200> with the backend in the browser, as on GitHub Pages. To
use the real server instead, start it in one terminal and the app in another:

```bash
bun run server
bun run dev:server
```

| Script               | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| `bun run dev`        | dev server with hot reload, the backend runs in the browser   |
| `bun run server`     | the backend as a Bun server on port 4000, restarts on changes |
| `bun run dev:server` | dev server that talks to `bun run server`                     |
| `bun run build`      | production build into `dist/`                                 |
| `bun run preview`    | the production build on the dev server                        |
| `bun run test`       | backend, store, directive, pipe and app tests (Vitest)        |
| `bun run typecheck`  | TypeScript check of the tests and the Bun server              |
| `bun run lint`       | Biome: lint, formatting, import order                         |
| `bun run format`     | apply every safe Biome fix and format the code                |

## Project structure

```
server/            my backend: api.ts, passwords.ts, storage.ts, seed.json,
                   main.ts (Bun server), browser.ts (in the browser), api.spec.ts
src/app/
  core/            API address, the in-browser backend interceptor, icons, theme, window
  auth/            AuthService, SessionStorageService, guards, token interceptor
  user/            UserService, UserStoreService, admin guard
  services/        CoursesService: every call about courses and authors
  store/           NgRx: courses (actions, reducer, selectors, effects, facade) and authors
  shared/          header, button, info, course card, search, modal, footer;
                   email validator, password toggle and *appIfAdmin directives; pipes
  features/        login, registration, courses (+ list), course page, course form,
                   the RxJS Star Wars page, about, 404
src/testing/       renders the whole app with the backend in memory
course-tasks/      EPAM's task sheets of the five modules (PDF)
course-lessons/    the lessons of the course as HTML, with their pictures
```

## Deployment

Every push to `main` is linted, type checked, tested, built and published by
`.github/workflows/deploy.yml`. One-time setup in the repository: **Settings → Pages → Source: GitHub
Actions**.

## Course material

The task sheets in [`course-tasks/`](course-tasks) are the task sections of EPAM's Angular
Fundamentals course material (version 1.1.0, a little newer than the one of my course in 2021); the
solutions are mine. The app shows them on pages of its own (`/#/tasks/…`), drawn with pdf.js.

The lessons in [`course-lessons/`](course-lessons) are the other sections of the same material,
turned from the course's document into HTML. Much of their text quotes the Angular and NgRx
documentation and the articles they link to; the links are kept, and open in a new tab.

The RxJS page uses the free [Star Wars API](https://swapi.dev), with a saved copy of its names for
when it does not answer.
