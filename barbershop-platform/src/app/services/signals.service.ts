// src/app/shared/services/app-signal.service.ts
import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSignalService {
  private globalSignal: WritableSignal<any> = signal(null); // Puede ser cualquier tipo

  // Exponer el signal directamente
  get data(): WritableSignal<any> {
    return this.globalSignal;
  }

  // Métodos utilitarios (opcional)
  set(value: any): void {
    this.globalSignal.set(value);
  }

  clear(): void {
    this.globalSignal.set(null);
  }
}