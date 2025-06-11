import { CommonModule } from '@angular/common';
import { Component, Input, Signal } from '@angular/core';

@Component({
  selector: 'app-appointment',
  imports: [CommonModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  @Input() serviciosSeleccionados!: Signal<any[]>;
  @Input() totalServicios!: Signal<number>;
  @Input() barberoSeleccionado!: Signal<any | null>;
  @Input() fechaReserva!: Signal<string | null>;
  @Input() horaReserva!: Signal<string | null>;
  @Input() showService: boolean;

  getNombresServicios(): string {
    return this.serviciosSeleccionados().map(s => s.nombre).join(', ');
  }
  getTimeServices(): string {
    const servicios = this.serviciosSeleccionados();
    if (servicios.length === 0) {
      return '0 minutos';
    }
    const total = servicios.reduce((acc, s) => acc + s.duracion, 0);
    return `${total} minutos`;
  }
  formatearFechaLocal(fecha: Date): string {
    return fecha.toLocaleDateString('sv-SE');
  }

}
