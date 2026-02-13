import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { isLoggedIn } from '../../auth/auth.selectors';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.pipe(
    select(isLoggedIn),
    tap(
      (isLoggedIn) => {
        if (!isLoggedIn) {
          router.navigate(['/auth']);
        }
      }
    ),
    first()
  );
};
