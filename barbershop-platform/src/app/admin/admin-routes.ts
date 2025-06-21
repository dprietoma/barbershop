import { Routes } from "@angular/router";
import { LoginComponent } from "./ui/pages/login/login.component";
import { DashboardComponent } from "./ui/pages/dashboard/dashboard.component";
import { ServiciosComponent } from "./ui/pages/servicios/servicios.component";

export const adminRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'servicios', component: ServiciosComponent },
];