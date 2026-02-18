import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { EntityCollectionServiceFactory, EntityCollectionService } from '@ngrx/data';
import { Car } from '../../../core/models/car';
import { CarPart } from '../../../core/models/car-part';
import { map, Observable, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-car-view',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './car-view.html',
  styleUrl: './car-view.css',
})
export class CarView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly factory = inject(EntityCollectionServiceFactory);

  private readonly carsService: EntityCollectionService<Car> =
    this.factory.create<Car>('Car');
  private readonly carPartsService: EntityCollectionService<CarPart> =
    this.factory.create<CarPart>('CarPart');

  car$: Observable<Car | null> = of(null);
  carParts$: Observable<CarPart[]> = of([]);
  loadingCarParts$: Observable<boolean> = of(false);

  ngOnInit(): void {
    const carId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCar(carId);
  }

  loadCar(carId: number): void {
    this.car$ = this.carsService.entityMap$.pipe(
      take(1),
      switchMap((entityMap) => {
        const cached = entityMap[carId];
        if (cached != null) {
          return of(cached);
        }
        return this.carsService.getByKey(carId);
      })
    );
    this.loadCarParts(carId);
  }

  loadCarParts(carId: number): void {
    this.carParts$ = this.carPartsService.entities$.pipe(
      switchMap(parts => {
        const hasPartsForCar = parts.some(p => p.carId === carId);
        if (hasPartsForCar) {
          return of(parts.filter(p => p.carId === carId));
        }
        return this.carPartsService.loadWithQuery({ carId }).pipe(
          switchMap(() => this.carPartsService.entities$.pipe(take(1))),
          map((loaded) => loaded.filter((p) => p.carId === carId))
        );
      })
    );
    this.loadingCarParts$ = this.carPartsService.loading$;
  }
}
