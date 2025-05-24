import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserva } from '../../utils/interface/reserva.interface';
import { ReservasService } from '../../services/ReservasService';
import { LoadingService } from '../../utils/LoadingService';

@Component({
  selector: 'app-appointment-confirmed',
  imports: [CommonModule, SteppersComponent],
  templateUrl: './appointment-confirmed.component.html',
  styleUrl: './appointment-confirmed.component.css'
})
export class AppointmentConfirmedComponent implements OnInit {
  @ViewChild('voucherRef', { static: false }) voucherRef!: ElementRef;
  dataAppointment: Reserva;
  idAppointment: string;
  constructor(
    private router: Router,
    private routeActive: ActivatedRoute,
    private reservasService: ReservasService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.getDataAppointment();
  }
  getDataAppointment() {
    this.routeActive.queryParams.subscribe(params => {
      const id = params['id'];
      const fecha = params['fecha'];
      const estado = params['estado'];
      if (id && fecha && estado) {
        this.loadingService.show();
        this.reservasService.GetReservationByCustomerDateStatus(id, fecha, estado)
          .then(reserva => {
            this.loadingService.hide();
            if (reserva) {
              this.dataAppointment = reserva;
            }
          })
          .catch(() => {
            console.log('Error', 'Error al consultar la reserva.', 'error');
          }).finally(() => {
            this.loadingService.hide();
          });
      }
    });

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
    this.router.navigate([path])
  }
}
