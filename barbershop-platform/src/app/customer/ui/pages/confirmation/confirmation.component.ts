import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DetailOrderComponent } from '../../components/detail-order/detail-order.component';
import { OrderStateService } from '../../../../utils/global/order-state.service';
import { AppointmentComponent } from '../../components/appointment/appointment.component';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { ModalTermsComponent } from '../../../../shared/modal-terms/modal-terms.component';
import { HistorialForzadoService } from '../../../../utils/global/route-history.service';
import { ReservasService } from '../../../../services/ReservasService';
import { Reserva } from '../../../../utils/interface/reserva.interface';
import { ShowAlert } from '../../../../utils/global/sweetalert';
@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, SteppersComponent,
    AppointmentComponent, ReactiveFormsModule,
    DetailOrderComponent, FooterComponent, ModalTermsComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {
  listIndicatorCountry = [
    { code: '+57', name: 'CO' },
    { code: '+1', name: 'USA' },
    { code: '+58', name: 'VE' },
    { code: '+52', name: 'ME' },
    { code: '+54', name: 'AR' },
  ];

  formDataPeople: FormGroup;
  constructor(private fb: FormBuilder,
    public order: OrderStateService,
    private route: Router,
    private reservasService: ReservasService,
    private loadingService: LoadingService,
    private historial: HistorialForzadoService,
    private sessionStorage: SessionStorageService) {
  }
  ngOnInit(): void {
    this.historial.forzarRegresoAHOME('/customer/confirmation');
    this.formDataPeople = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
          this.allowedDomainValidator(['gmail.com', 'hotmail.com', 'outlook.com']),
        ]
      ],
      country: ['+57', Validators.required],
      number: [
        '',
        [
          Validators.required,
          Validators.pattern(/^3\d{9}$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      numDoc: [
        '',
        [
          Validators.required,
          Validators.pattern(/^1\d{9}$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]
      ],
      terms: [false, Validators.requiredTrue]
    });


  }

  allowedDomainValidator(allowedDomains: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (!email || typeof email !== 'string') return null;

      const parts = email.split('@');
      if (parts.length !== 2) return null;

      const domain = parts[1].toLowerCase();
      return allowedDomains.includes(domain)
        ? null
        : { domainNotAllowed: true };
    };
  }
  extractMinutes(duration: string): number {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  onReserve() {
    if (this.formDataPeople.invalid) {
      this.formDataPeople.markAllAsTouched();
      return;
    }
    this.loadingService.show();
    const informationReserve = this.information();
    this.reservasService.createReservation(informationReserve).then(rs => {
      if (rs.ok) {
        this.reservasService.marcarHoraComoNoDisponible(
          informationReserve.barberoId,
          informationReserve.fecha,
          informationReserve.hora,
          this.extractMinutes(informationReserve.duracion)
        ).then(rs => {
          this.navigate();
        })
      } else {
        ShowAlert.viewAlert('Oops...', rs.mensaje, 'error');
      }
      this.loadingService.hide();
    })
  }
  formatearFechaLocal(fecha: Date): string {
    return fecha.toLocaleDateString('sv-SE');
  }
  getTimeServices(): string {
    const servicios = this.order.serviciosSeleccionados();
    if (servicios.length === 0) {
      return '0 minutos';
    }
    const total = servicios.reduce((acc, s) => acc + s.duracion, 0);
    return `${total} minutos`;
  }
  information(): Reserva {
    const fecha = this.order.fechaReserva();
    const item: Reserva = {
      barberoId: this.order.barberoSeleccionado()?.id,
      barberNombre: this.order.barberoSeleccionado()?.nombre,
      clienteNombre: this.formDataPeople.controls['name'].value,
      emailCustomer: this.formDataPeople.controls['email'].value,
      docNumberCustomer: this.formDataPeople.controls['numDoc'].value,
      phoneCustomer: this.formDataPeople.controls['number'].value,
      fecha: fecha ? this.formatearFechaLocal(fecha as any) : '',
      hora: this.order.horaReserva() ?? '',
      servicio: this.order.serviciosSeleccionados(),
      total: this.order.totalServicios(),
      estado: 'Confirmada',
      duracion: this.getTimeServices(),
      type: this.sessionStorage.getType('mode') as string
    }
    return item
  }
  navigate() {
    const data = this.information();
    sessionStorage.setItem('reserva', JSON.stringify(data));
    this.route.navigate(['/customer/appointment-confirmed']);
  }
}
