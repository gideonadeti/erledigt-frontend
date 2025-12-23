import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/sign-in',
    loadComponent: () => import('./auth/sign-in.component').then((c) => c.SignInComponent),
    canMatch: [() => import('./auth/auth-redirect.guard').then((m) => m.authRedirectGuard())],
  },
  {
    path: 'auth/sign-up',
    loadComponent: () => import('./auth/sign-up.component').then((c) => c.SignUpComponent),
    canMatch: [() => import('./auth/auth-redirect.guard').then((m) => m.authRedirectGuard())],
  },
];
