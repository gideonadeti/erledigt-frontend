import { Routes } from '@angular/router';

import { authRedirectGuard } from './auth/auth-redirect.guard';

export const routes: Routes = [
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
