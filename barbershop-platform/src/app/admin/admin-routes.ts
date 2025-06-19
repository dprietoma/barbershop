import { Routes } from "@angular/router";
import { LoginComponent } from "./ui/pages/login/login.component";
import { DashboardComponent } from "./ui/pages/dashboard/dashboard.component";
import { ShiftsComponent } from "./ui/pages/shifts/shifts.component";

export const adminRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'shifts', component: ShiftsComponent },
];