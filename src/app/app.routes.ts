import { Routes } from '@angular/router';

import { authRedirectGuard } from './auth/auth-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.component').then((c) => c.TasksComponent),
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./tasks/task.component').then((c) => c.TaskComponent),
  },
  {
    path: 'auth/sign-in',
    loadComponent: () => import('./auth/sign-in.component').then((c) => c.SignInComponent),
    canMatch: [authRedirectGuard],
  },
  {
    path: 'auth/sign-up',
    loadComponent: () => import('./auth/sign-up.component').then((c) => c.SignUpComponent),
    canMatch: [authRedirectGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((c) => c.NotFoundComponent),
  },
];
