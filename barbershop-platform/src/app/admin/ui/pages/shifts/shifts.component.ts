import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { DisponibilidadService } from '../../../../services/disponibilidad.service';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { ShowAlert } from '../../../../utils/global/sweetalert';


@Component({
  selector: 'app-shifts',
  imports: [CommonModule, BreadcrumbComponent,
    FormsModule, FooterComponent],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit {
  breadcrumbRoutes = [
    { label: 'Panel de Administración', url: 'admin/dashboard' },
    { label: 'Turnos y Pausas', url: 'admin/shifts' },
  ];
  barbers: any[] = [];
  selectedDate: string = this.getTodaysDate();
  selectedBarber: any = null;
  selectedHour: string = '';
  isAvailable: boolean = true;
  titleAvailable: string = '';
  @ViewChild('cerrarBtn') cerrarBtn!: ElementRef<HTMLButtonElement>;
  constructor(private disponibilidadService: DisponibilidadService,
    private loadingService: LoadingService
  ) { }
  ngOnInit(): void {
    this.loadAvailability();
  }
  async loadAvailability() {
    this.loadingService.show();
    try {
      this.barbers = await this.disponibilidadService.getAvailabilityByDate(this.selectedDate);
      if (this.barbers.length === 0) {
        ShowAlert.viewAlert(
          'Oops...',
          `No hay barberos disponibles para esta fecha: ${this.selectedDate}. Intenta cambiar o revisar en otra fecha.`,
          'info'
        );
      }
    } catch (err) {
      console.log('Error consultando la disponibilidad', err);
    } finally {
      this.loadingService.hide();
    }
  }
  getTodaysDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  abrirModal(barber: string, hora?: string, type?: string) {
    this.selectedHour = type === 'ByBarber' ? this.selectedDate : hora ?? '';
    this.titleAvailable = type === 'ByBarber' ? 'Fecha Seleccionada' : 'Hora Seleccionada';
    this.selectedBarber = barber;
  }
  async saveAvailability() {
    this.loadingService.show();
    try {
      if (this.selectedHour === this.selectedDate) {
        await this.disponibilidadService.updateAvailabilityAllDay(
          this.selectedBarber.id,
          this.selectedDate,
          this.isAvailable
        );
      } else {
        await this.disponibilidadService.updateAvailability(
          this.selectedBarber.id,
          this.selectedDate,
          this.selectedHour,
          this.isAvailable);
      }
      this.closeModal();
    } catch (err) {
      console.log('Error actualizando la disponibilidad', err);
    } finally {
      this.loadingService.hide();
    }
  }

  closeModal() {
    this.cerrarBtn.nativeElement.click();
    this.loadAvailability();

  }
  editBarberAvailability(barber: any) {
    console.log(`Editar disponibilidad general de ${barber.name}`);
  }

  getHora(barber: any, hora: string) {
    return barber.horas.find((h: any) => h.hora === hora) ?? { hora, disponible: false };
  }

  setSelectedSlot(barber: any, hour: string): void {
    this.selectedBarber = barber;
    this.selectedHour = hour;
  }
  getHorasUnicas(): string[] {
    const horasSet = new Set<string>();
    for (const barber of this.barbers) {
      for (const h of barber.horas) {
        horasSet.add(h.hora);
      }
    }

    return Array.from(horasSet).sort((a, b) =>
      this.convertirHoraATime(a).getTime() - this.convertirHoraATime(b).getTime()
    );
  }

  convertirHoraATime(hora: string): Date {
    const [time, ampm] = hora.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
  }


}
