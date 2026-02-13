import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Cars } from './cars';

const routes: Routes = [
  {
    path: '',
    component: Cars
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Cars
  ]
})
export class CarsModule { }
