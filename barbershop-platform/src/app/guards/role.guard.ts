import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { authState } from '@angular/fire/auth';
import { map, switchMap, take, of } from 'rxjs';

type AppRole = 'admin' | 'barber' | 'customer';

export const roleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): ReturnType<CanMatchFn> => {
  const router = inject(Router);
  const auth = inject(Auth);
  const firestore = inject(Firestore);

  const allowed = (route.data?.['roles'] ?? []) as AppRole[];

  // Si no declaraste roles en la ruta, niega por defecto
  if (!allowed.length) {
    return router.createUrlTree(['/customer/location']);
  }

  // URL tentativa (solo para logs/redirecciones opcionales)
  const attemptedUrl = '/' + segments.map(s => s.path).join('/');

  return authState(auth).pipe(
    take(1),
    switchMap(user => {
      if (!user) return of(false);
      // Lee el rol desde Firestore: users/{uid}.role
      const ref = doc(firestore, `users/${user.uid}`);
      return docData(ref).pipe(
        take(1),
        map((data: any) => {
          const role = data?.role as AppRole | undefined;
          return role ? allowed.includes(role) : false;
        })
      );
    }),
    map(ok => (ok ? true : router.createUrlTree(['/customer/location'])))
  );
};