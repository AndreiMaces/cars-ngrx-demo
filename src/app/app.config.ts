import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth/auth.effects';
import { provideRouterStore, RouterState } from '@ngrx/router-store';
import { provideEntityData, withEffects } from '@ngrx/data';
import { DefaultDataServiceConfig } from '@ngrx/data';
import { metaReducers, reducers } from './reducers';
import { carEntityMetadata } from './features/cars/car-entity-metadata';
import { carPartEntityMetadata } from './features/cars/car-part-entity-metadata';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(reducers, {
      metaReducers: metaReducers,
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
    ),
    {
      provide: DefaultDataServiceConfig,
      useValue: {
        root: 'api',
        entityHttpResourceUrls: {
          Car: {
            entityResourceUrl: 'api/cars/',
            collectionResourceUrl: 'api/cars/',
          },
          CarPart: {
            entityResourceUrl: 'api/carParts/',
            collectionResourceUrl: 'api/carParts/',
          },
        },
      },
    },
    provideEntityData(
      {
        entityMetadata: carEntityMetadata,
        pluralNames: { Car: 'cars' },
      },
      withEffects()
    ),
    provideEntityData(
      {
        entityMetadata: carPartEntityMetadata,
        pluralNames: { CarPart: 'carParts' },
      },
      withEffects()
    )
  ]
};
