import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-confirmed',
  imports: [CommonModule, SteppersComponent],
  templateUrl: './appointment-confirmed.component.html',
  styleUrl: './appointment-confirmed.component.css'
})
export class AppointmentConfirmedComponent {
  @ViewChild('voucherRef', { static: false }) voucherRef!: ElementRef;
  constructor(private route: Router) { }
  descargarVoucher() {
    if (typeof window !== 'undefined') {
      import('html2pdf.js').then(html2pdf => {
        const opt = {
          margin: 0.5,
          filename: 'comprobante-reserva.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true
          },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf.default()
          .set(opt)
          .from(this.voucherRef.nativeElement)
          .save();
      });
    }
  }
  navigate(path: string) {
    this.route.navigate([path])
  }
}
