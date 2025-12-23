import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

import { AuthService } from './auth.service';

export const authRedirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.fetchCurrentUser().pipe(
    map((user) => (user ? router.parseUrl('/') : true)),
    catchError(() => of(true))
  );
};
