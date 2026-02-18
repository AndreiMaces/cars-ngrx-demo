import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { Car } from '../../core/models/car';
import { map, filter, take, switchMap, of } from 'rxjs';

export const carsResolver: ResolveFn<void> = () => {
  const factory = inject(EntityCollectionServiceFactory);
  const carsService = factory.create<Car>('Car');

  return carsService.loaded$.pipe(
    take(1),
    switchMap((loaded) => {
      if (loaded) {
        return of(undefined);
      }
      carsService.load();
      return carsService.loaded$.pipe(
        filter((isLoaded) => isLoaded),
        take(1),
        map(() => undefined)
      );
    })
  );
};
