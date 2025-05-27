import { Injectable } from '@angular/core';
import { OrderStateService } from './order-state.service';

@Injectable({ providedIn: 'root' })
export class HistorialForzadoService {
  constructor(private order: OrderStateService) { }
  forzarRegresoAHOME(rutaActual: string): void {
    if (typeof window === 'undefined' || !rutaActual) return;
    this.order.reset();
    sessionStorage.removeItem('reserva');
    window.history.pushState({}, '', '/home');
    window.history.pushState({}, '', rutaActual);
  }
}
