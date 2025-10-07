import { Routes } from "@angular/router";
import { DashboardComponent } from "./ui/pages/dashboard/dashboard.component";
import { ServiciosComponent } from "./ui/pages/servicios/servicios.component";
import { ShiftsComponent } from "./ui/pages/shifts/shifts.component";
import { AppointmentsComponent } from "./ui/pages/appointments/appointments.component";
import { CollaboratorsComponent } from "./ui/pages/collaborators/collaborators.component";

export const adminRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'servicios', component: ServiciosComponent },
    { path: 'shifts', component: ShiftsComponent },
    { path: 'appointments', component: AppointmentsComponent },
    { path: 'collaborators', component: CollaboratorsComponent }
];