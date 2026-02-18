import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Cars } from './cars';
import { carsResolver } from './cars.resolver';
import { CarView } from './car-view/car-view';

const routes: Routes = [
  {
    path: '',
    component: Cars,
    resolve: { _: carsResolver },
  },
  {
    path: ':id',
    component: CarView,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Cars,
    CarView,
  ],
})
export class CarsModule { }
