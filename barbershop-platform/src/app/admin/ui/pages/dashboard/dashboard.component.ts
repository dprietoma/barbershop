import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GraphicsComponent } from '../../components/graphics/graphics.component';
@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbComponent, CommonModule,
    GraphicsComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  breadcrumbRoutes = [
    { label: 'Login', url: 'admin/login' },
    { label: 'Panel de Administración', url: 'admin/dashboard' },
  ];
  summaryCards = [
    { title: 'Total Clients', value: 530, trend: 3.5 },
    { title: 'Total Services', value: 26, trend: -0.5 },
    { title: 'Total Employees', value: 80, trend: 1.5 },
    { title: 'Total Appointments', value: 150, trend: 1.2 }
  ];

  bookings = [
    {
      service: 'Hair Cut',
      start: '9:30 AM',
      end: '5:15 PM',
      clientId: 23,
      employee: 'John Smith',
      avatar: 'https://i.pravatar.cc/40?u=johnsmith'
    },
    {
      service: 'Hair Trimming',
      start: '11:30 AM',
      end: '6:15 PM',
      clientId: 21,
      employee: 'Emily Davis',
      avatar: 'https://i.pravatar.cc/40?u=emilydavis'
    },
    {
      service: 'Hair Artistry',
      start: '12:30 AM',
      end: '8:15 PM',
      clientId: 35,
      employee: 'Olivia Wilson',
      avatar: 'https://i.pravatar.cc/40?u=oliviawilson'
    }
  ];
  dashboardCards = [
    {
      title: 'Citas',
      description: 'Gestiona y revisa las citas agendadas.',
      icon: 'bi bi-calendar-check',
      link: '/admin/appointments'
    },
    {
      title: 'Barberos',
      description: 'Administra el personal disponible.',
      icon: 'bi bi-person-badge',
      link: '/admin/barbers'
    },
    {
      title: 'Clientes',
      description: 'Consulta y gestiona los clientes.',
      icon: 'bi bi-people',
      link: '/admin/customers'
    },
    {
      title: 'Servicios',
      description: 'Crea, edita o elimina servicios ofrecidos.',
      icon: 'bi bi-scissors',
      link: '/admin/services'
    },
    {
      title: 'Pagos',
      description: 'Revisa pagos realizados y pendientes.',
      icon: 'bi bi-cash-coin',
      link: '/admin/payments'
    },
    {
      title: 'Estadísticas',
      description: 'Visualiza métricas y rendimiento.',
      icon: 'bi bi-bar-chart-line',
      link: '/admin/stats'
    },
    {
      title: 'Configuración',
      description: 'Ajusta el sistema y preferencias.',
      icon: 'bi bi-gear',
      link: '/admin/settings'
    },
    {
      title: 'Historial',
      description: 'Consulta el historial de citas y pagos.',
      icon: 'bi bi-clock-history',
      link: '/admin/history'
    }
  ];

}
