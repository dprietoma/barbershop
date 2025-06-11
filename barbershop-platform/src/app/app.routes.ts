import { Routes } from '@angular/router';
import { HomeComponent } from './customer/ui/pages/home/home.component';
import { LocationComponent } from './customer/ui/pages/location/location.component';
import { BarbersComponent } from './customer/ui/pages/barbers/barbers.component';
import { ConfirmationComponent } from './customer/ui/pages/confirmation/confirmation.component';
import { AppointmentConfirmedComponent } from './customer/ui/pages/appointment-confirmed/appointment-confirmed.component';
import { ListServicesComponent } from './customer/ui/pages/List-services/list-services.component';


export const routes: Routes = [
    { path: '', component: LocationComponent },
    { path: 'home', component: HomeComponent },
    { path: 'list-services', component: ListServicesComponent },
    { path: 'barbers', component: BarbersComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'appointment-confirmed', component: AppointmentConfirmedComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
