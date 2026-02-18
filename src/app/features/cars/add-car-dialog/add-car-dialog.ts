import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car } from '../../../core/models/car';

export interface CarFormValue {
  id?: number;
  make: string;
  model: string;
  year: number | null;
  color: string;
}

@Component({
  selector: 'app-add-car-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-car-dialog.html',
})
export class AddCarDialog {
  readonly yearMin = 1900;
  readonly yearMax = 2100;

  /** When set, dialog is in edit mode; when null, add mode. */
  readonly car = input<Car | null>(null);
  readonly saving = input<boolean>(false);
  readonly submitForm = output<CarFormValue>();
  readonly closeDialog = output<void>();

  form = new FormGroup({
    make: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    model: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    year: new FormControl<number | null>(null, {
      validators: [
        Validators.min(1900),
        Validators.max(2100),
      ],
    }),
    color: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  get make() {
    return this.form.controls.make;
  }
  get model() {
    return this.form.controls.model;
  }
  get year() {
    return this.form.controls.year;
  }
  get color() {
    return this.form.controls.color;
  }

  constructor() {
    effect(() => {
      this.saving() ? this.form.disable() : this.form.enable();
    });
    effect(() => {
      const c = this.car();
      if (c) {
        this.form.patchValue({
          make: c.make,
          model: c.model,
          year: c.year,
          color: c.color,
        });
      } else {
        this.form.reset({ make: '', model: '', year: null, color: '' });
      }
    });
  }

  get isEditMode(): boolean {
    return this.car() != null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { make, model, year, color } = this.form.getRawValue();
    const payload: CarFormValue = { make, model, year, color };
    if (this.car()) {
      payload.id = this.car()!.id;
    }
    this.submitForm.emit(payload);
  }

  onClose(): void {
    this.closeDialog.emit();
  }

  onBackdropClick(event: Event): void {
    if ((event.target as HTMLElement).hasAttribute('data-backdrop')) {
      this.onClose();
    }
  }
}
