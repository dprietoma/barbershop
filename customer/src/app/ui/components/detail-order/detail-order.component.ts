import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentComponent } from '../appointment/appointment.component';
import { OrderStateService } from '../../utils/order-state.service';

@Component({
  selector: 'app-detail-order',
  imports: [CommonModule, AppointmentComponent],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.css'
})
export class DetailOrderComponent {
  private router = inject(Router);
  @Input() serviciosSeleccionados!: Signal<any[]>;
  @Input() totalServicios!: Signal<number>;
  @Input() barberoSeleccionado!: Signal<any | null>;
  @Input() fechaReserva!: Signal<string | null>;
  @Input() horaReserva!: Signal<string | null>;
  @Input() titulo: string;
  @Input() viewButton: boolean;
  constructor(public order: OrderStateService){

  }

  navigateToBarbers() {
    this.router.navigate(['/barbers']);
  }
}
