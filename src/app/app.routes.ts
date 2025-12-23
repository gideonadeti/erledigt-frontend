import { Routes } from '@angular/router';

import { authRedirectGuard } from './auth/auth-redirect.guard';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.component').then((c) => c.TasksComponent),
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
];
