import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EntityCollectionServiceFactory, EntityCollectionService } from '@ngrx/data';
import { Car } from '../../core/models/car';
import { CarCard } from './car-card/car-card';
import { AddCarDialog } from './add-car-dialog/add-car-dialog';
import { EditCarDialog } from './edit-car-dialog/edit-car-dialog';
import type { CarFormValue } from './car-form/car-form';

@Component({
  selector: 'app-cars',
  imports: [AsyncPipe, CarCard, AddCarDialog, EditCarDialog],
  templateUrl: './cars.html',
  styleUrl: './cars.css',
})
export class Cars {
  private readonly entityCollectionServiceFactory = inject(EntityCollectionServiceFactory);
  readonly carsService: EntityCollectionService<Car> =
    this.entityCollectionServiceFactory.create<Car>('Car');

  readonly cars$ = this.carsService.entities$;
  readonly errors$ = this.carsService.errors$;
  readonly showCarDialog = signal(false);
  readonly carToEdit = signal<Car | null>(null);
  readonly carToDelete = signal<Car | null>(null);
  readonly savingDialog = signal(false);
  private addCorrelationId: string | null = null;

  openAddDialog(): void {
    this.carToEdit.set(null);
    this.showCarDialog.set(true);
  }

  openEditDialog(car: Car): void {
    this.carToEdit.set(car);
    this.showCarDialog.set(true);
  }

  openDeleteConfirm(car: Car): void {
    this.carToDelete.set(car);
  }

  closeDeleteConfirm(): void {
    this.carToDelete.set(null);
  }

  confirmDeleteCar(): void {
    const car = this.carToDelete();
    if (!car) return;
    this.carsService.delete(car.id, { isOptimistic: true });
    if (this.carToEdit()?.id === car.id) {
      this.closeCarDialog();
    }
    this.closeDeleteConfirm();
  }

  closeCarDialog(): void {
    if (this.savingDialog() && this.addCorrelationId) {
      this.carsService.cancel(this.addCorrelationId, 'User canceled');
    }
    this.savingDialog.set(false);
    this.addCorrelationId = null;
    this.carToEdit.set(null);
    this.showCarDialog.set(false);
  }

  onSubmitAdd(value: CarFormValue): void {
    this.addCorrelationId = `add-car-${Date.now()}`;
    this.savingDialog.set(true);
    this.carsService
      .add(value, {
        correlationId: this.addCorrelationId,
        isOptimistic: false,
      })
      .subscribe({
        next: () => {
          this.savingDialog.set(false);
          this.addCorrelationId = null;
          this.closeCarDialog();
        },
        error: () => {
          this.savingDialog.set(false);
          this.addCorrelationId = null;
        },
      });
  }

  onSubmitEdit(value: CarFormValue): void {
    if (value.id == null) return;
    this.carsService.update(
      {
        id: value.id,
        make: value.make,
        model: value.model,
        year: value.year,
        color: value.color,
      },
      { isOptimistic: true }
    );
    this.closeCarDialog();
  }
}
