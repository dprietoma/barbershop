import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NavigationAccessService } from '../ui/utils/global/route-history.service';

export const navigationGuard: CanActivateFn = () => {
  const navAccess = inject(NavigationAccessService);
  const router = inject(Router);

  if (navAccess.isAccessAllowed()) {
    navAccess.reset();
    return true;
  }

  setTimeout(() => {
    router.navigateByUrl('/home');
  }, 0);

  return false;
};
