import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanMatchFn = (): ReturnType<CanMatchFn> => {
  const router = inject(Router);
  const auth = inject(Auth);

  return authState(auth).pipe(
    take(1),
    map(user => (user ? true : router.createUrlTree(['/customer/location'])))
  );
};