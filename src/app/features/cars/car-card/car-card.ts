import { Component, input } from '@angular/core';
import { Car } from '../../../core/models/car';

@Component({
  selector: 'app-car-card',
  standalone: true,
  templateUrl: './car-card.html',
})
export class CarCard {
  readonly car = input.required<Car>();
}
