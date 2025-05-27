import { Routes } from '@angular/router';
import { HomeComponent } from './ui/pages/home/home.component';
import { LocationComponent } from './ui/pages/location/location.component';
import { BarbersComponent } from './ui/pages/barbers/barbers.component';
import { ConfirmationComponent } from './ui/pages/confirmation/confirmation.component';
import { AppointmentConfirmedComponent } from './ui/pages/appointment-confirmed/appointment-confirmed.component';
import { ListServicesComponent } from './ui/pages/List-services/list-services.component';


export const routes: Routes = [
    { path: '', component: LocationComponent },
    { path: 'home', component: HomeComponent },
    { path: 'list-services', component: ListServicesComponent },
    { path: 'barbers', component: BarbersComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'appointment-confirmed', component: AppointmentConfirmedComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
