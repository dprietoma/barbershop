import { Routes } from "@angular/router";
import { LoginComponent } from "./ui/pages/login/login.component";
import { DashboardComponent } from "./ui/pages/dashboard/dashboard.component";
import { ServiciosComponent } from "./ui/pages/servicios/servicios.component";
import { ShiftsComponent } from "./ui/pages/shifts/shifts.component";
import { AppointmentsComponent } from "./ui/pages/appointments/appointments.component";
import { CollaboratorsComponent } from "./ui/pages/collaborators/collaborators.component";
import { CustomizeComponent } from "./ui/pages/customize/customize.component";

export const adminRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'servicios', component: ServiciosComponent },
    { path: 'shifts', component: ShiftsComponent },
    { path: 'appointments', component: AppointmentsComponent },
    { path: 'collaborators', component: CollaboratorsComponent },
    {path: 'custom', component: CustomizeComponent}, 
];