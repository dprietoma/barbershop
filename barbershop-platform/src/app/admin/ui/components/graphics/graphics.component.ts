import { Component, inject, Renderer2 } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.css'
})
export class GraphicsComponent {
  public lineChartType: ChartType = 'line';
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  public lineChartData: ChartData<'line'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Mayor' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Medio' },
      { data: [18, 38, 30, 29, 76, 37, 60], label: 'Bajo' }
    ]
  };
}
