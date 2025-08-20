import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                // ruta pública que monta tu componente de shared
                loadComponent: () =>
                    import('./shared/login/login.component').then(m => m.LoginComponent),
            },
        ],
    },
    {
        path: 'customer',
        loadChildren: () =>
            import('./customer/customer.routes').then(m => m.customerRoutes),
    },
    {
        path: 'admin',
        // canMatch: [authGuard, roleGuard],
        data: { roles: ['admin'] },
        loadChildren: () =>
            import('./admin/admin-routes').then(m => m.adminRoutes),
    },
    {
        path: 'barbers',
        // canMatch: [authGuard, roleGuard],
        data: { roles: ['barber', 'admin'] },
        loadChildren: () =>
            import('./barbers/barbers.routes').then(m => m.barbersRoutes),
    },
    {
        path: '',
        redirectTo: 'customer/location',
        pathMatch: 'full',
    },
];
