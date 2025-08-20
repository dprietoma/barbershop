import { Routes } from "@angular/router";
import { DashboardComponent } from "./ui/pages/dashboard/dashboard.component";
import { AppointmentsComponent } from "./ui/pages/appointments/appointments.component";


export const barbersRoutes: Routes = [
  { path: '', redirectTo: 'location', pathMatch: 'full' },
  { path: 'dashboard-barbers' , component: DashboardComponent},
  { path: 'appointments' , component: AppointmentsComponent},
  { path: '**', redirectTo: 'location' }
];