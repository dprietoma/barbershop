import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { Reserva } from '../../../../utils/interface/reserva.interface';
import { TableComponent } from '../../../../shared/table/table.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { StoriesService } from '../../../../services/stories.service';
import { ShowAlert } from '../../../../utils/global/sweetalert';
import { ReservasService } from '../../../../services/ReservasService.service';
import { SUCCESS_DELETE, SUCCESS_UPDATE } from '../../../../utils/constants/General-Constants';

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
    { key: 'phoneCustomer', label: 'Celular', type: 'phone' },
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
    { icon: 'bi-flag-fill', color: 'blue', label: 'Finalizadas', statusValue: 'Finalizada' }
  ];
  selectedTab = 0;
  ListFormAppointments = [
    {
      title: 'Nombre Cliente',
      name: 'clienteNombre',
      type: 'text',
      placeholder: 'Nombre Completo',
      validation: [Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-person-circle icon-color fs-5',
      class: 'col-md-4',
      disabled: true,
    },
    {
      title: 'Celular',
      name: 'phoneCustomer',
      type: 'text',
      placeholder: 'Ingrese Celular',
      validation: [
        Validators.required,
        Validators.pattern(/^3\d{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
      icon: 'bi-telephone icon-color fs-5',
      class: 'col-md-4',
      disabled: true,
    },
    {
      title: 'Barbero',
      name: 'barberNombre',
      type: 'text',
      placeholder: 'Ingrese Barbero',
      validation: [Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-person-gear icon-color fs-5',
      class: 'col-md-4',
      disabled: true,
    },
    {
      title: 'Fecha',
      name: 'fecha',
      type: 'text',
      placeholder: 'Ingrese Fecha',
      validation: [Validators.required],
      icon: 'bi-calendar-event icon-color fs-5',
      class: 'col-md-4',
      disabled: true,
    },
    {
      title: 'Hora',
      name: 'hora',
      type: 'text',
      placeholder: 'Ingrese Hora',
      validation: [Validators.required],
      icon: 'bi-alarm icon-color fs-5',
      class: 'col-md-4',
      disabled: true,
    },
    {
      title: 'Estado',
      name: 'estado',
      type: 'select',
      placeholder: 'Seleccione Estado',
      validation: [Validators.required],
      icon: 'bi-list icon-color fs-5',
      class: 'col-md-4',
      options: [
        { label: 'Confirmada', value: 'Confirmada' },
        { label: 'En Curso', value: 'En Curso' },
        { label: 'Finalizada', value: 'Finalizada' },
      ]
    },
    {
      title: 'Total',
      name: 'total',
      type: 'currency',
      placeholder: 'Ingrese Total',
      validation: [Validators.required],
      icon: 'bi-cash-coin icon-color fs-5',
      class: 'col-md-4',
      disabled: true,
      mask: 'separator.0',
      prefix: '$ ',
      thousandSeparator: '.'
    },
  ];

  constructor(private loadingService: LoadingService,
    private storieService: StoriesService,
    private reservasService: ReservasService
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
    this.storieService.getReservationsByStateAndDate(this.status, this.selectedDate)
      .subscribe({
        next: reservas => {
          this.appointmentsTable = reservas;
          this.loadingService.hide();
          if (this.appointmentsTable.length === 0) {
            ShowAlert.viewAlert(
              'Sin reservas disponibles',
              `No se encontraron reservas para la fecha ${this.selectedDate} con estado ${this.status}. Intenta cambiar los filtros o revisar en otra fecha.`,
              'info'
            );
          }
        },
        error: err => {
          console.error('Error consultando las reservas', err);
          this.loadingService.hide();
        }
      });
  }

  getTodaysDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  onItemSelect(item: any) {
    console.log('Seleccionado:', item);
  }
  handleAction(event: any) {
    if (event.action === 'delete') {
      this.deleteAppointments(event.row.id);
    }
  }

  async editAppointments(event: any) {
    this.loadingService.show();
    try {
      await this.reservasService.updateReservation(event.id, event);
      ShowAlert.viewAlert('info', SUCCESS_UPDATE, 'success');
      this.AppointmentsByDate();
    } catch (error) {
      console.error('Error editando la cita', error);
    } finally {
      this.loadingService.hide();
    }
  }
  async deleteAppointments(id: string) {
    this.loadingService.show()
    try {
      await this.reservasService.deleteReservation(id);
      ShowAlert.viewAlert('info', SUCCESS_DELETE, 'success');
      this.AppointmentsByDate();
    } catch (error) {
      console.error('Error eliminando la cita', error);
    } finally {
      this.loadingService.hide();
    }
  }
}
