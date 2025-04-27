import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-direction-maps',
  imports: [CommonModule],
  templateUrl: './direction-maps.component.html',
  styleUrl: './direction-maps.component.css'
})
export class DirectionMapsComponent {
  horarios = [
    { dia: 'Lunes', apertura: '10:00 AM', cierre: '08:00 PM' },
    { dia: 'Martes', apertura: '10:00 AM', cierre: '08:00 PM' },
    { dia: 'Miércoles', apertura: '10:00 AM', cierre: '08:00 PM' },
    { dia: 'Jueves', apertura: '10:00 AM', cierre: '08:00 PM' },
    { dia: 'Viernes', apertura: '10:00 AM', cierre: '08:00 PM' },
    { dia: 'Sábado', apertura: '10:00 AM', cierre: '08:00 PM' },
    { dia: 'Domingo', apertura: '10:00 AM', cierre: '06:00 PM' },
  ];
  direccionMaps = 'Carrera 81c #4a Sur, Bogotá';
  horarioExpandido = false;

  toggleHorario() {
    this.horarioExpandido = !this.horarioExpandido;
  }
}
