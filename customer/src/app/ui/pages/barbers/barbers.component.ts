import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { Router } from '@angular/router';
import { OrderStateService } from '../../utils/order-state.service';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { HorasDisponibles } from '../../utils/interface/availableHours-interface';
import { HOURS } from '../../utils/constants/horasDefault';
import { BarberosService } from '../../services/barberos.service';
import { Barbero } from '../../utils/interface/barbero-interface';
import { LoadingService } from '../../utils/LoadingService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barbers',
  imports: [CommonModule, SteppersComponent, FormsModule],
  templateUrl: './barbers.component.html',
  styleUrl: './barbers.component.css'
})
export class BarbersComponent implements OnInit {
  public order = inject(OrderStateService);
  private router = inject(Router);
  private availableService = inject(DisponibilidadService);
  private barberosService = inject(BarberosService);
  private loadingService = inject(LoadingService);

  Stepper: number = 2;
  barberos: Barbero[] = [];
  horas: HorasDisponibles = {
    manana: [],
    tarde: [],
    noche: []
  };
  barberoSeleccionado: any = null;
  mesActual = new Date();
  semanaVisible: Date[] = [];
  diaSeleccionado: Date | null = null;
  filtroTexto = '';


  ngOnInit() {
    this.getBarber();
    // this.generarSemana(this.mesActual);
  }
  getBarber() {
    this.loadingService.show();
    this.barberosService.obtenerBarberos().subscribe(data => {
      this.barberos = data;
      this.loadingService.hide();
    });
  }
  seleccionar(barbero: any) {
    this.barberoSeleccionado = barbero;
    this.order.setBarbero(this.barberoSeleccionado);
    this.Stepper = 3;
    this.generarSemana(this.barberoSeleccionado.id)
  }

  get baberosFiltrados() {
    return this.barberos.filter(barbero =>
      barbero.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase())
    );
  }


  selectDate(hora: string) {
    this.order.setHora(hora);
    this.router.navigate(['/confirmation'])
  }

  generarSemana(barberId: string, baseDate?: Date) {
    const start = new Date(baseDate ?? new Date());
    start.setDate(start.getDate() - 3);
    this.semanaVisible = [];

    for (let i = 0; i < 14; i++) {
      const dia = new Date(start);
      dia.setDate(start.getDate() + i);
      this.semanaVisible.push(dia);

      const fechaStr = dia.toISOString().split('T')[0];
      this.availableService.crearDisponibilidadSiNoExiste(barberId, fechaStr, HOURS)
        .then(() => console.log(`Disponibilidad creada para ${fechaStr}`))
        .catch(err => console.error(`Error creando disponibilidad:`, err));
    }
  }

  retrocederSemana() {
    const nuevaFecha = new Date(this.mesActual);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    this.mesActual = nuevaFecha;
    //this.generarSemana(this.mesActual);
  }

  avanzarSemana() {
    const nuevaFecha = new Date(this.mesActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    this.mesActual = nuevaFecha;
    //this.generarSemana(this.mesActual);
  }
  formatearFechaLocal(fecha: Date): string {
    return fecha.toLocaleDateString('sv-SE');
  }
  seleccionarDia(dia: Date) {
    this.diaSeleccionado = dia;
    this.order.setFecha(this.diaSeleccionado as any);
    const fechaStr = this.formatearFechaLocal(dia);

    this.availableService.getHorasDisponibles(this.barberoSeleccionado.id, fechaStr).subscribe({
      next: (disponibilidad) => {
        const horasDisponibles = disponibilidad?.horas ?? [];

        this.availableService.getReservasPorDia(this.barberoSeleccionado.id, fechaStr).subscribe(reservas => {
          let horasOcupadas: string[] = [];
          reservas.forEach(r => {
            const duracionMinutos = parseInt(r.duracion);
            const franjas = this.obtenerFranjasOcupadas(r.hora, duracionMinutos, horasDisponibles);
            horasOcupadas.push(...franjas);
          });
          const horasUnicas = [...new Set(horasOcupadas)];
          const horasFiltradas = horasDisponibles.filter((hora: string) => !horasUnicas.includes(hora));
          this.horas = {
            manana: horasFiltradas.filter((h: string) => this.esManana(h)),
            tarde: horasFiltradas.filter((h: string) => this.esTarde(h)),
            noche: horasFiltradas.filter((h: string) => this.esNoche(h)),
          };
        });
      }
    });
  }
  obtenerFranjasOcupadas(horaInicio: string, duracion: number, todasLasFranjas: string[]): string[] {
    const inicioMin = this.horaToMinutos(horaInicio);
    const finMin = inicioMin + duracion;

    return todasLasFranjas.filter(franja => {
      const minutosFranja = this.horaToMinutos(franja);
      return minutosFranja >= inicioMin && minutosFranja < finMin;
    });
  }
  horaToMinutos(hora: string): number {
    const [time, meridian] = hora.split(' ');
    let [h, m] = time.split(':').map(Number);

    if (meridian === 'PM' && h !== 12) h += 12;
    if (meridian === 'AM' && h === 12) h = 0;

    return h * 60 + m;
  }
  esManana(hora: string): boolean {
    const date = this.parseHora(hora);
    const horaReal = date.getHours();
    return horaReal >= 9 && horaReal < 12;
  }

  esTarde(hora: string): boolean {
    const date = this.parseHora(hora);
    const horaReal = date.getHours();
    return horaReal >= 12 && horaReal < 17;
  }

  esNoche(hora: string): boolean {
    const date = this.parseHora(hora);
    const horaReal = date.getHours();
    return horaReal >= 17;
  }
  private parseHora(hora: string): Date {
    return new Date(`1970-01-01T${this.to24HourFormat(hora)}:00`);
  }

  private to24HourFormat(hora: string): string {
    const [time, modifier] = hora.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (modifier === 'PM' && h !== 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

 
}
