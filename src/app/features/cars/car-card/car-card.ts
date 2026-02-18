import { Component, input, output } from '@angular/core';
import { Car } from '../../../core/models/car';

@Component({
  selector: 'app-car-card',
  standalone: true,
  templateUrl: './car-card.html',
})
export class CarCard {
  readonly car = input.required<Car>();
  readonly editCar = output<Car>();
  readonly deleteCar = output<Car>();
}
