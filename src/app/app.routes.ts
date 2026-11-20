import type { Routes } from '@angular/router'
import { authorizedGuard } from './auth/guards/authorized.guard'
import { notAuthorizedGuard } from './auth/guards/not-authorized.guard'

/**
 * Every page is a lazy chunk: the routes of the course, plus the RxJS task, an About page,
 * EPAM's task sheets and a 404 page.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'courses' },
  {
    path: 'login',
    title: 'Login',
    canActivate: [notAuthorizedGuard],
    loadComponent: () => import('./features/login/login'),
  },
  {
    path: 'registration',
    title: 'Registration',
    canActivate: [notAuthorizedGuard],
    loadComponent: () => import('./features/registration/registration'),
  },
  {
    path: 'courses',
    canMatch: [authorizedGuard],
    loadChildren: () => import('./features/courses/courses.routes'),
  },
  {
    path: 'rxjs',
    title: 'RxJS: Star Wars',
    loadComponent: () => import('./features/star-wars/star-wars'),
  },
  { path: 'about', title: 'About', loadComponent: () => import('./features/about/about') },
  {
    path: 'lessons/:slug',
    title: 'Lesson',
    loadComponent: () => import('./features/lessons/lesson'),
  },
  {
    path: 'tasks/:sheet',
    title: 'Task sheet',
    loadComponent: () => import('./features/task-sheets/task-sheet'),
  },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () => import('./features/not-found/not-found'),
  },
]
