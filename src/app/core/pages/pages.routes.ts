import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";

export default [
    {
        path: 'login',
        loadChildren: () => import('./login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'products',
        loadChildren: () => import('./products/products.component').then(m => m.ProductsComponent),
        canActivate: [AuthGuard]
    }
] satisfies Routes;