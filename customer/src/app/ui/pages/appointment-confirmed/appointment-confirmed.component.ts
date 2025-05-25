import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Reserva } from '../../utils/interface/reserva.interface';
import { ReservasService } from '../../services/ReservasService';
import { LoadingService } from '../../utils/LoadingService';
import { firstValueFrom } from 'rxjs';

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
    private routeActive: ActivatedRoute,
    private reservasService: ReservasService,
    private loadingService: LoadingService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      if (typeof history !== 'undefined') {
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', () => {
          history.pushState(null, '', location.href);
        });
      }
      const cached = sessionStorage.getItem('reserva');
      if (cached) {
        this.dataAppointment = JSON.parse(cached);
        return;
      } else {
        const params = await firstValueFrom(this.routeActive.queryParams);
        const { id, fecha, estado } = params;
        if (id && fecha && estado) {
          await this.getDataAppointment(id, fecha, estado);
        }
      }
    }
  }




  async getDataAppointment(id: string, fecha: string, estado: string) {
    if (fecha && id && estado) {
      this.loadingService.show();
      this.reservasService.GetReservationByCustomerDateStatus(id,
        fecha, estado)
        .then(reserva => {
          if (reserva) {
            this.dataAppointment = reserva;
            sessionStorage.setItem('reserva', JSON.stringify(this.dataAppointment));
          } else {
            console.log('Sin resultados', 'No se encontró la reserva.', 'info');
          }
        })
        .catch(() => {
          console.log('Error', 'Error al consultar la reserva.', 'error');
        })
        .finally(() => {
          this.loadingService.hide();
        });
    } {
      console.log('Pasó algo con el filtro')
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
    this.router.navigate([path])
  }
}
