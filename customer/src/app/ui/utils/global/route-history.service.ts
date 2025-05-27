import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HistorialForzadoService {

  forzarRegresoAHOME(rutaActual: string): void {
    if (typeof window === 'undefined' || !rutaActual) return;

    window.history.pushState({}, '', '/home');
    window.history.pushState({}, '', rutaActual);
  }
}
