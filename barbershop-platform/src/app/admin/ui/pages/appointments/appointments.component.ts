import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { ListService } from '../../../../services/listServices.service';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { PERCENTAGE } from '../../../../utils/constants/horasDefault';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule,
    FooterComponent, TableComponent, BreadcrumbComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  private listService = inject(ListService);
  appointmentsTable: Reserva[] = [];
  user: any;
  filtroConfig = {
    filterBy: 'clienteNombre',
    placeholder: 'Buscar reserva...'
  };
  breadcrumbRoutes = [
    { label: 'Panel de Administración', url: 'admin/dashboard' },
    { label: 'Control de reservas', url: 'admin/appointments' },
  ];
  cols: any = [];
  selectedDate: string = this.getTodaysDate();
  status: string = 'Confirmada';
  tabs = [
    { icon: 'bi-check-circle-fill', color: 'green', label: 'Confirmadas', statusValue: 'Confirmada' },
    { icon: 'bi-play-circle-fill', color: 'yellow', label: 'En Curso', statusValue: 'En Curso' },
    { icon: 'bi-flag-fill', color: 'blue', label: 'Finalizadas', statusValue: 'Finalizada' }
  ];
  selectedTab = 0;
  ListFormAppointments: any[] = [];

  servicesData: any[] = [];

  constructor(private loadingService: LoadingService,
    private storieService: StoriesService,
    private reservasService: ReservasService,
    private sessionStorage: SessionStorageService
  ) { }
  ngOnInit(): void {
    this.user = this.sessionStorage.getType('user');
    this.buildColumns();
    this.AppointmentsByDate();
  }
  buildColumns() {
    const keyTotal = this.validateRol();
    this.cols = [
      { key: 'clienteNombre', label: 'Cliente' },
      { key: 'phoneCustomer', label: 'Celular', type: 'phone' },
      { key: 'barberNombre', label: 'Barbero' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'hora', label: 'Hora' },
      { key: 'estado', label: 'Estado', type: 'badge' },
      { key: keyTotal, label: 'Total', type: 'currency' },
      { key: '', label: '', type: 'actions' }
    ];
  }
  validateRol(): string {
    const role = (this.user?.role || '').toLowerCase();
    return role === 'admin' ? 'gananciaBarberia' : 'gananciaBarbero';
  }
  buildFormFields() {
    this.ListFormAppointments = [
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
        class: 'col-md-3',
        disabled: true,
      },
      {
        title: 'Hora',
        name: 'hora',
        type: 'text',
        placeholder: 'Ingrese Hora',
        validation: [Validators.required],
        icon: 'bi-alarm icon-color fs-5',
        class: 'col-md-3',
        disabled: true,
      },
      {
        title: 'Estado',
        name: 'estado',
        type: 'select',
        placeholder: 'Seleccione Estado',
        validation: [Validators.required],
        icon: 'bi-list icon-color fs-5',
        class: 'col-md-3',
        options: [
          { label: 'Confirmada', value: 'Confirmada' },
          { label: 'En Curso', value: 'En Curso' },
          { label: 'Finalizada', value: 'Finalizada' },
        ]
      },
      {
        title: 'Total',
        name: this.validateRol(),
        type: 'currency',
        placeholder: 'Ingrese Total',
        validation: [Validators.required],
        icon: 'bi-cash-coin icon-color fs-5',
        class: 'col-md-3',
        disabled: true,
        mask: 'separator.0',
        prefix: '$ ',
        thousandSeparator: '.'
      },
      {
        title: '',
        name: '',
        type: 'table',
        placeholder: '',
        validation: [],
        icon: '',
        class: 'col-md-12',
        options: this.servicesData
      }
    ];
  }
  getServices() {
    this.loadingService.show();
    this.listService.getAllServices().subscribe({
      next: (res) => {
        this.servicesData = res;
        this.loadingService.hide();
        this.buildFormFields();
      },
      error: (err) => {
        this.loadingService.hide();
        ShowAlert.viewAlert('Oops...', 'Algo salio mal en la consulta', 'error');
      }
    });
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
          this.getServices();
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
    event.gananciaBarberia = Number((event.total * PERCENTAGE).toFixed(2));
    event.gananciaBarbero = Number((event.total * PERCENTAGE).toFixed(2))
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
