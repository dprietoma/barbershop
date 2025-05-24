import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { Router } from '@angular/router';
import { OrderStateService } from '../../utils/order-state.service';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { HorasDisponibles } from '../../utils/interface/availableHours-interface';
import { HOURS } from '../../utils/constants/horasDefault';
import { BarberosService } from '../../services/barberos.service';
import { Barbero } from '../../utils/interface/barbero-interface';
import { LoadingService } from '../../utils/LoadingService';

@Component({
  selector: 'app-barbers',
  imports: [CommonModule, SteppersComponent],
  templateUrl: './barbers.component.html',
  styleUrl: './barbers.component.css'
})
export class BarbersComponent implements OnInit {
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
  constructor(private router: Router,
    public order: OrderStateService,
    private availableService: DisponibilidadService,
    private barberosService: BarberosService,
    private loadingService: LoadingService) {

  }

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
          const horasOcupadas = reservas.map(r => r.hora);

          const horasFiltradas = horasDisponibles.filter((hora: string) => !horasOcupadas.includes(hora));

          this.horas = {
            manana: horasFiltradas.filter((h: string) => this.esManana(h)),
            tarde: horasFiltradas.filter((h: string) => this.esTarde(h)),
            noche: horasFiltradas.filter((h: string) => this.esNoche(h)),
          };
        });
      }
    });
  }
  esManana(hora: string): boolean {
    return hora.includes('AM') && parseInt(hora) < 12;
  }

  esTarde(hora: string): boolean {
    return hora.includes('PM') && parseInt(hora) < 6;
  }

  esNoche(hora: string): boolean {
    return hora.includes('PM') && parseInt(hora) >= 6;
  }
}
