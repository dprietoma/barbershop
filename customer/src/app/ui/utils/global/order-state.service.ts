import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderStateService {
  private _serviciosSeleccionados = signal<any[]>([]);
  serviciosSeleccionados = this._serviciosSeleccionados.asReadonly();

  private _barbero = signal<any | null>(null);
  barberoSeleccionado = this._barbero.asReadonly();

  private _fecha = signal<string | null>(null);
  fechaReserva = this._fecha.asReadonly();

  private _hora = signal<string | null>(null);
  horaReserva = this._hora.asReadonly();

  totalServicios = computed(() =>
    this._serviciosSeleccionados().reduce((acc, s) => acc + s.precio, 0)
  );

  toggleServicio(servicio: any) {
    const actuales = this._serviciosSeleccionados();
    const index = actuales.findIndex(s => s.nombre === servicio.nombre);

    if (index > -1) {
      this._serviciosSeleccionados.set([
        ...actuales.slice(0, index),
        ...actuales.slice(index + 1)
      ]);
    } else {
      this._serviciosSeleccionados.set([...actuales, servicio]);
    }
  }

  setBarbero(barbero: any) {
    this._barbero.set(barbero);
  }

  setFecha(fecha: string) {
    this._fecha.set(fecha);
  }

  setHora(hora: string) {
    this._hora.set(hora);
  }

  reset() {
    this._serviciosSeleccionados.set([]);
    this._barbero.set(null);
    this._fecha.set(null);
    this._hora.set(null);
  }
}

