import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EntityCollectionServiceFactory, EntityCollectionService } from '@ngrx/data';
import { Car } from '../../core/models/car';

@Component({
  selector: 'app-cars',
  imports: [AsyncPipe],
  templateUrl: './cars.html',
  styleUrl: './cars.css',
})
export class Cars {
  private readonly entityCollectionServiceFactory = inject(EntityCollectionServiceFactory);
  readonly carsService: EntityCollectionService<Car> =
    this.entityCollectionServiceFactory.create<Car>('Car');

  readonly cars$ = this.carsService.entities$;
  readonly loading$ = this.carsService.loading$;
  readonly errors$ = this.carsService.errors$;
}
