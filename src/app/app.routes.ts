import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './core/guards/is-authenticated-guard';
import { isNotAuthenticatedGuard } from './core/guards/is-not-authenticated-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [isNotAuthenticatedGuard],
        loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
    },
    {
        path: 'cars',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./features/cars/cars-module').then(m => m.CarsModule)
    }
];
