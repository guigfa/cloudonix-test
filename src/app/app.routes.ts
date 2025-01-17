import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./core/pages/login/login.component').then(m => m.LoginComponent),

    },
    {
        path: 'products',
        loadComponent: () => import('./core/pages/products/products.component').then(m => m.ProductsComponent),
        canActivate: [AuthGuard]
    }
];
