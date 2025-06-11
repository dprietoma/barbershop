import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-steppers',
  imports: [CommonModule],
  templateUrl: './steppers.component.html',
  styleUrl: './steppers.component.css'
})
export class SteppersComponent {
  @Input() currentStep: number = 0;
  @Output() stepClicked = new EventEmitter<string>();
  constructor(private router: Router) { }
  steps = [
    { icon: 'bi-scissors', title: 'Selección del servicio', path: '/customer/list-services' },
    { icon: 'bi-person-badge', title: 'Selección del barbero', path: '/customer/barbers' },
    { icon: 'bi-calendar-event ', title: 'Selección de fecha y hora', path: '/customer/barbers' },
    { icon: 'bi-check2-circle', title: 'Confirmación de la cita', path: '/customer/confirmation' },
    { icon: 'bi bi-house-fill', title: 'Cita agendada con éxito', path: '/customer/appointment-confirmed' }
  ];
  onStepClick(index: number) {
    if (this.router.url === '/appointment-confirmed') return;
    const step = this.steps[index];
    if (index < this.currentStep) {
      this.router.navigateByUrl(step.path);
    }
  }
}
