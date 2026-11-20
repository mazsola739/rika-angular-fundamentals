import type { Routes } from '@angular/router'
import { adminGuard } from '../../user/guards/admin.guard'

/** /courses and its pages; the whole tree is loaded only for a logged-in user (authorizedGuard). */
export default [
  { path: '', title: 'Courses', loadComponent: () => import('./courses') },
  {
    path: 'add',
    title: 'New course',
    canActivate: [adminGuard],
    loadComponent: () => import('../course-form/course-form'),
  },
  {
    path: 'edit/:id',
    title: 'Edit course',
    canActivate: [adminGuard],
    loadComponent: () => import('../course-form/course-form'),
  },
  { path: ':id', title: 'Course', loadComponent: () => import('../course-info/course-info') },
] satisfies Routes
