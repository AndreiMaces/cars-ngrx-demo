import { Component, input, output } from '@angular/core';
import { Car } from '../../../core/models/car';
import { CarForm, CarFormValue } from '../car-form/car-form';

@Component({
  selector: 'app-edit-car-dialog',
  standalone: true,
  imports: [CarForm],
  templateUrl: './edit-car-dialog.html',
})
export class EditCarDialog {
  readonly car = input.required<Car>();
  readonly submitForm = output<CarFormValue>();
  readonly closeDialog = output<void>();

  onBackdropClick(event: Event): void {
    if ((event.target as HTMLElement).hasAttribute('data-backdrop')) {
      this.closeDialog.emit();
    }
  }
}
