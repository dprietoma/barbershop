import { Component } from '@angular/core';
import { TableComponent } from '../../../../shared/table/table.component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { GraphicsComponent } from '../../../../admin/ui/components/graphics/graphics.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { StoriesService } from '../../../../services/stories.service';
import { Reserva } from '../../../../utils/interface/reserva.interface';

@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbComponent, CommonModule,
    GraphicsComponent, RouterModule, FooterComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  breadcrumbRoutes = [
    { label: 'Login', url: 'admin/login' },
    { label: 'Panel de Administración', url: 'barbers/dashboard-barbers' },
  ];
  cols = [
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'phoneCustomer', label: 'Celular' },
    { key: 'barberNombre', label: 'Barbero' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'total', label: 'Total', type: 'currency'  }
  ];
  summaryCards: {
    title: string;
    value: string | number;
    icon: string;
    bg: string;
    color: string;
  }[] = [];
  appointmentsTable: Reserva[] = [];
  filtroConfig = {
    filterBy: 'clienteNombre',
    placeholder: 'Buscar reserva...'
  };
  constructor(private reservationsService: StoriesService,
    private loadingService: LoadingService
  ) { }
  ngOnInit(): void {
    this.getAppointments();

  }
  getAppointments(): void {
    this.loadingService.show();
    this.reservationsService.getReservations().subscribe({
      next: reservas => {
        this.generateAppointmentsTable(reservas);
        this.loadingService.hide();
      },
      error: err => {
        console.error('Error cargando reservas:', err);
        this.loadingService.hide();
      }
    });
  }
  onItemSelect(item: any) {
    console.log('Seleccionado:', item);
  }

  handleAction(event: any) {
    if (event.action === 'edit') {
      // abrir modal de edición
    } else if (event.action === 'delete') {
      // mostrar confirmación
    }
  }

  generateAppointmentsTable(reservations: Reserva[]) {
    this.appointmentsTable = reservations;
    const totalAppointments = reservations.length;
    const income = reservations
      .filter(r => r.estado === 'Confirmada')
      .reduce((acc, r) => acc + Number(r.total || 0), 0);
    const services = reservations.reduce((acc, r) => {
      const currentServices = Array.isArray(r.servicio) ? r.servicio.length : 1;
      return acc + currentServices;
    }, 0);

    const uniqueClients = new Set(reservations.map(r => r.docNumberCustomer)).size;

    this.summaryCards = [
      {
        title: 'Total Citas',
        value: totalAppointments,
        icon: 'bi-calendar-check',
        bg: '#0d6efd',
        color: 'text-primary'
      },
      {
        title: 'Servicios',
        value: services,
        icon: 'bi-scissors',
        bg: '#198754',
        color: 'text-success'
      }
    ];
  }
}
