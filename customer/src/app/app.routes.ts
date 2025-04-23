import { Routes } from '@angular/router';
import { HomeComponent } from './ui/pages/home/home.component';
import { LocationComponent } from './ui/pages/location/location.component';

export const routes: Routes = [
    { path: '', component: LocationComponent },
    { path: 'home', component: HomeComponent }, 
    { path: '**', redirectTo: '' }, // Redirección para rutas inválidas
];
