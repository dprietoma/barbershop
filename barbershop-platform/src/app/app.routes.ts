import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'customer',
        loadChildren: () =>
            import('./customer/customer.routes').then(m => m.customerRoutes),
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./admin/admin-routes').then(m => m.adminRoutes),
    },
    {
        path: '',
        redirectTo: 'customer',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'customer',
    }
];
