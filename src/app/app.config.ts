import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './auth/reducers';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth/auth.effects';
import { provideRouterStore, RouterState } from '@ngrx/router-store';
import { routerReducer } from '@ngrx/router-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ auth: authReducer, router: routerReducer }, {
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthEffects),
    provideRouterStore(
      {
        stateKey: 'router',
        routerState: RouterState.Minimal
      }
    )
  ]
};
