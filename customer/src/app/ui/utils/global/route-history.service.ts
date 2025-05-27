import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HistorialForzadoService {
  constructor() { }
  forzarRegresoAHOME(rutaActual: string): void {
    if (typeof window === 'undefined' || !rutaActual) return;
    window.history.pushState({}, '', '/');
    window.history.pushState({}, '', rutaActual);
  }
}
