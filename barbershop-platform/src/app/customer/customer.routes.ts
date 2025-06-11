import { Routes } from "@angular/router";
import { LocationComponent } from "./ui/pages/location/location.component";
import { HomeComponent } from "./ui/pages/home/home.component";
import { ListServicesComponent } from "./ui/pages/List-services/list-services.component";
import { BarbersComponent } from "./ui/pages/barbers/barbers.component";
import { ConfirmationComponent } from "./ui/pages/confirmation/confirmation.component";
import { AppointmentConfirmedComponent } from "./ui/pages/appointment-confirmed/appointment-confirmed.component";

export const customerRoutes: Routes = [
    { path: '', component: LocationComponent },
    { path: 'home', component: HomeComponent },
    { path: 'list-services', component: ListServicesComponent },
    { path: 'barbers', component: BarbersComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'appointment-confirmed', component: AppointmentConfirmedComponent },
];
