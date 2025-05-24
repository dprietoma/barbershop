import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-steppers',
  imports: [CommonModule],
  templateUrl: './steppers.component.html',
  styleUrl: './steppers.component.css'
})
export class SteppersComponent {
  @Input() currentStep: number = 0;
  steps = [
    { icon: 'bi-scissors', title: 'Selección del servicio' },
    { icon: 'bi-person-badge', title: 'Selección del barbero' },
    { icon: 'bi-calendar-event ', title: 'Selección de fecha y hora' },
    { icon: 'bi-check2-circle', title: 'Confirmación de la cita' },
    { icon: 'bi bi-house-fill', title: 'Cita agendada con éxito' }
  ];
}
