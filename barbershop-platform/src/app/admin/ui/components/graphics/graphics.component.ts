import { Component, effect, inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { StoriesService } from '../../../../services/stories.service';
import { AppSignalService } from '../../../../services/signals.service';
import { SessionStorageService } from '../../../../utils/global/StorageService ';

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.css'
})
export class GraphicsComponent implements OnInit {
  ngZone = inject(NgZone);
  reservationsService = inject(StoriesService);
  appSignal= inject(AppSignalService);
  tipoUse: any;
  public lineChartType: ChartType = 'doughnut';
  public isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  appointmentsPerDay: ChartData<'bar'> = { labels: [], datasets: [] };
  monthlyRevenue: ChartData<'line'> = { labels: [], datasets: [] };
  popularServices: ChartData<'doughnut'> = { labels: [], datasets: [] };

  constructor(private sessionStorage: SessionStorageService){
    effect(() => {
       const rol = (this.appSignal.data()?.valor ?? '').toLowerCase();
       const esBarbero = rol === 'barbero' || rol === 'barber';
       this.tipoUse = !esBarbero; // mostrar si NO es barbero
    })
  }

  user: any;
  ngOnInit(): void {
    this.user = JSON.parse(this.sessionStorage.getType('user') as any);
    if(this.user){
      this.ngZone.run(() => {
        this.reservationsService.getReservationsTodayByStatus('Confirmada', this.user?.phoneNumber as any).subscribe((reservations: any[]) => {
          this.appointmentsPerDay = this.buildAppointmentsPerDayChart(reservations);
          this.monthlyRevenue = this.buildMonthlyRevenueChart(reservations);
          this.popularServices = this.buildPopularServicesChart(reservations) as any;
        });
      });
    }
  }

  buildAppointmentsPerDayChart(reservations: any[]): ChartData<'bar'> {
    const countByDay: Record<string, number> = {};
    reservations.forEach(r => {
      const date = r.fecha instanceof Timestamp ? r.fecha.toDate() : new Date(r.fecha);
      const dayKey = date.toISOString().split('T')[0];
      countByDay[dayKey] = (countByDay[dayKey] || 0) + 1;
    });

    return {
      labels: Object.keys(countByDay),
      datasets: [
        {
          label: 'Citas por día',
          data: Object.values(countByDay),
          backgroundColor: '#0d6efd'
        }
      ]
    };
  }

  buildMonthlyRevenueChart(reservations: any[]): ChartData<'line'> {
    const revenueByMonth: Record<string, number> = {};
    reservations
      .filter(r => r.estado === 'Finalizada')
      .forEach(r => {
        const date = r.fecha instanceof Timestamp ? r.fecha.toDate() : new Date(r.fecha);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + Number(this.user?.role === 'admin' ? r.gananciaBarberia : r.gananciaBarbero || 0);
      });

    return {
      labels: Object.keys(revenueByMonth),
      datasets: [
        {
          label: 'Ingresos Mensuales',
          data: Object.values(revenueByMonth),
          borderColor: 'rgba(30, 127, 92, 0.2)',
          backgroundColor: '#1E7F5C',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#1E7F5C',
          pointBorderColor: '#1E7F5C',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#1E7F5C'
        }
      ]
    };
  }

  buildPopularServicesChart(reservations: any[]): ChartData<'bar'> {
    const serviceCount: Record<string, number> = {};

    reservations.forEach(r => {
      const services = Array.isArray(r.servicio) ? r.servicio : [r.servicio];
      services.forEach((service: any) => {
        const label = typeof service === 'string' ? service : service?.nombre || 'Desconocido';
        serviceCount[label] = (serviceCount[label] || 0) + 1;
      });
    });

    const colors = ['#0d6efd', '#dc3545', '#ffc107', '#198754', '#6f42c1', '#20c997', '#6610f2'];
    const labels = Object.keys(serviceCount);

    return {
      labels: labels,
      datasets: labels.map((label, index) => ({
        label: label,
        data: [serviceCount[label]],
        backgroundColor: colors[index % colors.length]
      }))
    };
  }

}
