import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { Router } from '@angular/router';
import { DisponibilidadService } from '../../../../services/disponibilidad.service';
import { HorasDisponibles } from '../../../../utils/interface/availableHours-interface';
import { HOURS } from '../../../../utils/constants/horasDefault';
import { BarberosService } from '../../../../services/barberos.service';
import { Barbero } from '../../../../utils/interface/barbero-interface';
import { FormsModule } from '@angular/forms';
import { OrderStateService } from '../../../../utils/global/order-state.service';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { SearchFilterComponent } from '../../../../shared/search-filter/search-filter.component';
import { FilterPipe } from '../../../../utils/pipes/filter.pipe';
import { HistorialForzadoService } from '../../../../utils/global/route-history.service';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { FooterComponent } from '../../../../shared/footer/footer.component';


@Component({
  selector: 'app-barbers',
  imports: [CommonModule, SteppersComponent,
    FormsModule, SearchFilterComponent, FilterPipe,
    FooterComponent],
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
  filtroTexto: string = '';
  mode: string | null = null;

  private readonly filterPipe = new FilterPipe();
  constructor(private historial: HistorialForzadoService,
    private sessionStorage: SessionStorageService
  ) { }


  ngOnInit() {
    this.mode = this.sessionStorage.getType('mode');
    this.historial.forzarRegresoAHOME('/barbers');
    this.getBarber();
    this.diaSeleccionado = new Date();
    const barbero = this.order.barberoSeleccionado();
    const fecha = this.order.fechaReserva();
    const hora = this.order.horaReserva();
    if (barbero && fecha && hora) {
      this.barberoSeleccionado = barbero;
      this.generarSemana(barbero.id, fecha ? new Date(fecha) : new Date());
      this.diaSeleccionado = new Date(fecha);
      this.seleccionarDia(this.diaSeleccionado);
      this.Stepper = 3;
    }
  }

  filterUpdate(text: string) {
    this.filtroTexto = text;
  }
  get quantityResults(): number {
    return this.filterPipe.transform(this.barberos, 'nombre', this.filtroTexto).length;
  }
  getBarber() {
    this.loadingService.show();
    this.barberosService.GetBarbersByType(this.mode as string).subscribe(data => {
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

  selectDate(hora: string) {
    this.order.setHora(hora);
    this.router.navigate(['/confirmation'])
  }
  mostrarRetroceder(): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return !this.semanaVisible.some(dia => {
      const d = new Date(dia);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === hoy.getTime();
    });
  }
  generarSemana(barberId: string, baseDate?: Date) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const start = new Date(baseDate ?? new Date());
    start.setDate(start.getDate() - 3);
    this.semanaVisible = [];
    for (let i = 0; i < 14; i++) {
      const dia = new Date(start);
      dia.setDate(start.getDate() + i);
      const diaNormalizado = new Date(dia);
      diaNormalizado.setHours(0, 0, 0, 0);
      if (diaNormalizado < hoy) {
        continue;
      }
      this.semanaVisible.push(dia);
      const fechaStr = dia.toISOString().split('T')[0];
      this.availableService.createAvailabilityIfNotExists(barberId, fechaStr, HOURS)
        .then(() => console.log(`Disponibilidad creada para ${fechaStr}`))
        .catch(err => console.error(`Error creando disponibilidad:`, err));
    }
  }


  retrocederSemana() {
    const nuevaFecha = new Date(this.mesActual);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    this.mesActual = nuevaFecha;
    this.generarSemana(this.barberoSeleccionado.id, this.mesActual);
  }

  avanzarSemana() {
    const nuevaFecha = new Date(this.mesActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    this.mesActual = nuevaFecha;
    this.generarSemana(this.barberoSeleccionado.id, this.mesActual);
  }
  formatearFechaLocal(fecha: Date): string {
    return fecha.toLocaleDateString('sv-SE');
  }
  showHours(disponibilidad: any, day: Date, fechaStr: string) {
    let horasDisponibles = disponibilidad?.horas ?? [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diaNormalizado = new Date(day);
    diaNormalizado.setHours(0, 0, 0, 0);

    if (diaNormalizado.getTime() === hoy.getTime()) {
      const ahora = new Date();
      horasDisponibles = horasDisponibles.filter((hora: string) => {
        const horaDate = this.convertirHoraATime(hora);
        return horaDate > ahora;
      });
    }

    this.availableService.getReservationsPerDay(this.barberoSeleccionado.id, fechaStr).subscribe(reservas => {
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
  seleccionarDia(dia: Date) {
    this.diaSeleccionado = dia;
    this.order.setFecha(this.diaSeleccionado as any);
    const fechaStr = this.formatearFechaLocal(dia);
    this.availableService.getAvailableHours(this.barberoSeleccionado.id, fechaStr).subscribe({
      next: (disponibilidad) => {
        if (!disponibilidad?.disponible) {
          this.horas = { manana: [], tarde: [], noche: [] };
          return;
        }
        this.showHours(disponibilidad, dia, fechaStr);
      }
    });
  }
  convertirHoraATime(hora: string): Date {
    const [horaMin, meridiano] = hora.split(' ');
    let [horas, minutos] = horaMin.split(':').map(Number);

    if (meridiano === 'PM' && horas !== 12) horas += 12;
    if (meridiano === 'AM' && horas === 12) horas = 0;

    const resultado = new Date();
    resultado.setHours(horas, minutos, 0, 0);

    return resultado;
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
