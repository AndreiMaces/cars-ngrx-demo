import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { isLoggedOut } from '../../auth/auth.selectors';
import { first, tap } from 'rxjs';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.pipe(
    select(isLoggedOut),
    tap(
      (isLoggedOut) => {
        if (!isLoggedOut) {
          router.navigate(['/cars']);
        }
      }
    ),
    first()
  );
};
