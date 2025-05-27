import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { NavigationStart, Router } from '@angular/router';
import { Reserva } from '../../utils/interface/reserva.interface';
import { filter, Subscription } from 'rxjs';
import { OrderStateService } from '../../utils/global/order-state.service';


@Component({
  selector: 'app-appointment-confirmed',
  imports: [CommonModule, SteppersComponent],
  templateUrl: './appointment-confirmed.component.html',
  styleUrl: './appointment-confirmed.component.css'
})
export class AppointmentConfirmedComponent implements OnInit, OnDestroy {
  @ViewChild('voucherRef', { static: false }) voucherRef!: ElementRef;
  dataAppointment: Reserva;
  private navigationSub!: Subscription;
  constructor(
    private router: Router,
    private order: OrderStateService

  ) {

  }

  async ngOnInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('reserva');
      if (cached) {
        this.dataAppointment = JSON.parse(cached);
      }
    }
    this.navigationSub = this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          this.order.reset();
          this.router.navigateByUrl('/home', { replaceUrl: true });
        }
      });
  }
  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
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
