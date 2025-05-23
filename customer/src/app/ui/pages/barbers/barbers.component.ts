import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { Router } from '@angular/router';
import { OrderStateService } from '../../utils/order-state.service';

@Component({
  selector: 'app-barbers',
  imports: [CommonModule, SteppersComponent],
  templateUrl: './barbers.component.html',
  styleUrl: './barbers.component.css'
})
export class BarbersComponent implements OnInit {
  Stepper: number = 2;
  barberos = [
    {
      id: 1,
      nombre: 'Erik Alexander',
      ig: '@erik.arce333',
      rol: 'Barbero',
      rating: 5.0,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 2,
      nombre: 'Santiago Serna',
      ig: '@santiagoserna09',
      rol: 'Barbero',
      rating: 4.9,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 3,
      nombre: 'Juan Gil',
      ig: '@11_juangil',
      rol: 'Barbero',
      rating: 5.0,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 4,
      nombre: 'Diego Ruiz',
      ig: '@diego.ruiz__',
      rol: 'Barbero Senior',
      rating: 5.0,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 5,
      nombre: 'Marlon Rodríguez',
      ig: '@roodz.barber',
      rol: 'Barbero',
      rating: 4.8,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 6,
      nombre: 'Alejandro González',
      ig: '@alejandro.gonz',
      rol: 'Barbero',
      rating: 5.0,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 7,
      nombre: 'Cristian Ríos',
      ig: '@cristian.rios',
      rol: 'Especialista en barba',
      rating: 4.7,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 8,
      nombre: 'Andrés Mejía',
      ig: '@andres.mejia',
      rol: 'Barbero Junior',
      rating: 4.6,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 9,
      nombre: 'Kevin Torres',
      ig: '@kevin.torres',
      rol: 'Estilista Urbano',
      rating: 5.0,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      id: 10,
      nombre: 'Daniel Restrepo',
      ig: '@daniel.rest',
      rol: 'Barbero',
      rating: 4.9,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    }
  ];
  horas = {
    manana: ['09:00 AM', '10:00 AM'] as string[],
    tarde: ['02:00 PM', '05: 00 PM'] as string[],
    noche: ['06:00 PM', '07:00 PM'] as string[]
  };
  barberoSeleccionado: any = null;
  mesActual = new Date();
  semanaVisible: Date[] = [];
  diaSeleccionado: Date | null = null;
  constructor(private router: Router, public order: OrderStateService) {

  }

  ngOnInit() {
    this.generarSemana(this.mesActual);
  }

  seleccionar(barbero: any) {
    this.barberoSeleccionado = barbero;
    this.order.setBarbero(this.barberoSeleccionado);
    this.Stepper = 3;
  }
  selectDate(hora: string) {
    this.order.setHora(hora);
    this.router.navigate(['/confirmation'])
  }

  generarSemana(baseDate: Date) {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - 3);
    this.semanaVisible = Array.from({ length: 14 }, (_, i) => {
      const dia = new Date(start);
      dia.setDate(start.getDate() + i);
      return dia;
    });
  }

  retrocederSemana() {
    const nuevaFecha = new Date(this.mesActual);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    this.mesActual = nuevaFecha;
    this.generarSemana(this.mesActual);
  }

  avanzarSemana() {
    const nuevaFecha = new Date(this.mesActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    this.mesActual = nuevaFecha;
    this.generarSemana(this.mesActual);
  }

  seleccionarDia(dia: Date) {
    this.diaSeleccionado = dia;
    this.order.setFecha(this.diaSeleccionado as any);
    if (dia.toDateString() === new Date(2025, 4, 4).toDateString()) {
      this.horas = {
        manana: ['10:00 AM', '10:40 AM'],
        tarde: ['12:00 PM', '2:00 PM', '2:40 PM', '3:20 PM', '4:00 PM', '4:40 PM'],
        noche: ['7:20 PM']
      };
    } else {
      this.horas = { manana: [], tarde: [], noche: [] };
    }
  }
}
