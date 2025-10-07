import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GraphicsComponent } from '../../components/graphics/graphics.component';
import { Timestamp } from 'firebase/firestore';
import { StoriesService } from '../../../../services/stories.service';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { TableComponent } from '../../../../shared/table/table.component';
import { Reserva } from '../../../../utils/interface/reserva.interface';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { SessionStorageService } from '../../../../utils/global/StorageService ';

@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbComponent, CommonModule,
    GraphicsComponent, RouterModule, FooterComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  breadcrumbRoutes = [
    { label: 'Login', url: 'admin/login' },
    { label: 'Panel de Administración', url: 'admin/dashboard' },
  ];
  cols: any = [];
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
  user: any;
  constructor(private reservationsService: StoriesService,
    private loadingService: LoadingService,
    private sessionStorage: SessionStorageService
  ) { }
  ngOnInit(): void {
    this.user = JSON.parse(this.sessionStorage.getType('user') as any) ;
    this.buildColumns();
    if( this.user){
      this.getAppointments(); 
    }

  }
  buildColumns() {
    const keyTotal = this.validateRol();
    this.cols = [
      { key: 'clienteNombre', label: 'Cliente' },
      { key: 'phoneCustomer', label: 'Celular' },
      { key: 'barberNombre', label: 'Barbero' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'hora', label: 'Hora' },
      { key: 'estado', label: 'Estado', type: 'badge' },
      { key: keyTotal, label: 'Total', type: 'currency' }
    ];
  }
  validateRol(): string {
    const role = (this.user?.role || '').toLowerCase();
    return role === 'admin' ? 'gananciaBarberia' : 'gananciaBarbero';
  }
  getAppointments(): void {
    this.loadingService.show();
    this.reservationsService.getReservationsTodayByStatus('Confirmada',this.user?.phoneNumber as any).subscribe({
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
    } else if (event.action === 'delete') {
    }
  }
  generateAppointmentsTable(reservations: Reserva[]) {
    this.appointmentsTable = reservations;
    const totalAppointments = reservations.length;
    const income = reservations
      .filter(r => r.estado === 'Confirmada')
      .reduce((acc, r) => acc + Number(this.user?.role === 'admin' ? r.gananciaBarberia : r.gananciaBarbero || 0), 0);
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
        title: 'Proximos ingresos',
        value: income.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }),
        icon: 'bi-cash-coin',
        bg: '#dc3545',
        color: 'text-danger'
      },
      {
        title: 'Servicios',
        value: services,
        icon: 'bi-scissors',
        bg: '#198754',
        color: 'text-success'
      },
      {
        title: 'Clientes',
        value: uniqueClients >= 1000 ? (uniqueClients / 1000).toFixed(1) + 'K' : uniqueClients,
        icon: 'bi-people-fill',
        bg: '#ffc107',
        color: 'text-warning'
      }
    ];
  }

}
