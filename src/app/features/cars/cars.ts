import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EntityCollectionServiceFactory, EntityCollectionService } from '@ngrx/data';
import { Car } from '../../core/models/car';
import { CarCard } from './car-card/car-card';
import { AddCarDialog, AddCarFormValue } from './add-car-dialog/add-car-dialog';

@Component({
  selector: 'app-cars',
  imports: [AsyncPipe, CarCard, AddCarDialog],
  templateUrl: './cars.html',
  styleUrl: './cars.css',
})
export class Cars {
  private readonly entityCollectionServiceFactory = inject(EntityCollectionServiceFactory);
  readonly carsService: EntityCollectionService<Car> =
    this.entityCollectionServiceFactory.create<Car>('Car');

  readonly cars$ = this.carsService.entities$;
  readonly errors$ = this.carsService.errors$;
  readonly showAddDialog = signal(false);
  readonly savingAdd = signal(false);
  private addCorrelationId: string | null = null;

  openAddDialog(): void {
    this.showAddDialog.set(true);
  }

  closeAddDialog(): void {
    if (this.savingAdd()) {
      if (this.addCorrelationId) {
        this.carsService.cancel(this.addCorrelationId, 'User canceled');
      }
    }
    this.savingAdd.set(false);
    this.addCorrelationId = null;
    this.showAddDialog.set(false);
  }

  onAddCar(value: AddCarFormValue): void {
    this.addCorrelationId = `add-car-${Date.now()}`;
    this.savingAdd.set(true);
    this.carsService
      .add(value, { correlationId: this.addCorrelationId, isOptimistic: false })
      .subscribe({
        next: () => {
          this.savingAdd.set(false);
          this.addCorrelationId = null;
          this.closeAddDialog();
        },
        error: () => {
          this.savingAdd.set(false);
          this.addCorrelationId = null;
        },
      });
  }
}
