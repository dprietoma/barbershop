import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../../../../utils/interface/reserva.interface';
import { TableComponent } from '../../../../shared/table/table.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { StoriesService } from '../../../../services/stories.service';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule,
    FooterComponent, TableComponent, BreadcrumbComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointmentsTable: Reserva[] = [];
  filtroConfig = {
    filterBy: 'clienteNombre',
    placeholder: 'Buscar reserva...'
  };
  breadcrumbRoutes = [
    { label: 'Panel de Administración', url: 'admin/dashboard' },
    { label: 'Control de reservas', url: 'admin/appointments' },
  ];
  cols = [
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'phoneCustomer', label: 'Celular' },
    { key: 'barberNombre', label: 'Barbero' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'total', label: 'Total', type: 'currency' },
    { key: '', label: '', type: 'actions' }
  ];
  selectedDate: string = this.getTodaysDate();
  status: string = 'Confirmada';
  tabs = [
    { icon: 'bi-check-circle-fill', color: 'green', label: 'Confirmadas', statusValue: 'Confirmada' },
    { icon: 'bi-play-circle-fill', color: 'yellow', label: 'En Curso', statusValue: 'En Curso' },
    { icon: 'bi-flag-fill', color: 'blue', label: 'Finalizadas', statusValue: 'Finalizada' },
    { icon: 'bi-x-circle-fill', color: 'red', label: 'Canceladas', statusValue: 'Cancelada' },
  ];



  selectedTab = 0;
  constructor(private loadingService: LoadingService,
    private reservationsService: StoriesService
  ) { }
  ngOnInit(): void {
    this.AppointmentsByDate();
  }
  selectTab(index: number): void {
    this.selectedTab = index;
    this.status = this.tabs[index].statusValue;
    this.AppointmentsByDate();
  }
  AppointmentsByDate(): void {
    this.loadingService.show();
    try {
      this.reservationsService.getReservationsByStateAndDate(this.status, this.selectedDate).subscribe({
        next: reservas => {
          this.appointmentsTable = reservas;
        }
      })
    } catch (error) {
      console.log('error consultado las reservas', error);
    } finally {
      this.loadingService.hide();
    }
  }
  getTodaysDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
}
