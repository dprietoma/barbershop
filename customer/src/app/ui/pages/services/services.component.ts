import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  servicios = [
    {
      nombre: 'Corte y Barba',
      descripcion: 'Servicio completo que incluye corte de cabello y arreglo de barba con estilo profesional.',
      precio: 30000,
      duracion: 90,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Clásico',
      descripcion: 'Un corte limpio y clásico, perfecto para cualquier ocasión.',
      precio: 25000,
      duracion: 60,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    // Agrega más servicios aquí
  ];
  
  isCollapsed = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
