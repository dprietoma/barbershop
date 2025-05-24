import { Routes } from '@angular/router';
import { HomeComponent } from './ui/pages/home/home.component';
import { LocationComponent } from './ui/pages/location/location.component';
import { ServicesComponent } from './ui/pages/services/services.component';
import { BarbersComponent } from './ui/pages/barbers/barbers.component';
import { ConfirmationComponent } from './ui/pages/confirmation/confirmation.component';
import { AppointmentConfirmedComponent } from './ui/pages/appointment-confirmed/appointment-confirmed.component';


export const routes: Routes = [
    { path: '', component: LocationComponent },
    { path: 'home', component: HomeComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'barbers', component: BarbersComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'appointment-confirmed', component: AppointmentConfirmedComponent },
    { path: '**', redirectTo: '' },
];
