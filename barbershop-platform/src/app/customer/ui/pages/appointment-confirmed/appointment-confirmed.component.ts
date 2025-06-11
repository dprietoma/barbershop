import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { Router } from '@angular/router';
import { Reserva } from '../../../../utils/interface/reserva.interface';
import { OrderStateService } from '../../../../utils/global/order-state.service';
import { HistorialForzadoService } from '../../../../utils/global/route-history.service';



@Component({
  selector: 'app-appointment-confirmed',
  imports: [CommonModule, SteppersComponent],
  templateUrl: './appointment-confirmed.component.html',
  styleUrl: './appointment-confirmed.component.css'
})
export class AppointmentConfirmedComponent implements OnInit {
  @ViewChild('voucherRef', { static: false }) voucherRef!: ElementRef;
  dataAppointment: Reserva;
  constructor(
    private router: Router,
    private order: OrderStateService,
    private historial: HistorialForzadoService
  ) {}

  async ngOnInit(): Promise<void> {
    this.historial.forzarRegresoAHOME('/customer/appointment-confirmed');
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('reserva');
      if (cached) {
        this.dataAppointment = JSON.parse(cached);
      }
    }
  }

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
  formatearFecha(fechaStr: string): string {
    const [anio, mes, dia] = fechaStr?.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    const nombreMes = fecha.toLocaleString('es-ES', { month: 'long' });
    return `${dia} de ${nombreMes}, ${anio}`;
  }
  navigate(path: string) {
    sessionStorage.removeItem('reserva');
    this.order.reset();
    this.router.navigate([path])
  }
}
