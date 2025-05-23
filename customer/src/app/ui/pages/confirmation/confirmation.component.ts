import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DetailOrderComponent } from '../../components/detail-order/detail-order.component';
import { OrderStateService } from '../../utils/order-state.service';
import { AppointmentComponent } from '../../components/appointment/appointment.component';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, SteppersComponent,
    AppointmentComponent, ReactiveFormsModule, DetailOrderComponent],
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
  constructor(private fb: FormBuilder, public order: OrderStateService) {
  }
  ngOnInit(): void {
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

  onReserve() {
    if (this.formDataPeople.invalid) {
      this.formDataPeople.markAllAsTouched();
      return;
    }
    console.log('es suave piloto')
  }
}
