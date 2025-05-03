import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent  {
  private router = inject(Router);
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
      nombre: 'Arreglo de Barba',
      descripcion: 'Definición y diseño de barba con navaja caliente y productos premium.',
      precio: 15000,
      duracion: 30,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Afeitado Clásico',
      descripcion: 'Afeitado con toalla caliente, espuma especial y navaja, como en la vieja escuela.',
      precio: 20000,
      duracion: 40,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Infantil',
      descripcion: 'Corte especial para niños, con paciencia y estilo moderno.',
      precio: 20000,
      duracion: 45,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Color o Tinte',
      descripcion: 'Aplicación de tinte profesional para cabello o barba, incluye asesoría personalizada.',
      precio: 40000,
      duracion: 90,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Diseño de Cejas',
      descripcion: 'Definición de cejas con pinza o navaja para realzar tu mirada.',
      precio: 10000,
      duracion: 15,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Limpieza Facial Exprés',
      descripcion: 'Rápida limpieza facial para revitalizar tu piel después del corte.',
      precio: 18000,
      duracion: 30,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Corte Premium',
      descripcion: 'Corte con asesoría de estilo, productos premium y finalización con cera o pomada.',
      precio: 35000,
      duracion: 75,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    },
    {
      nombre: 'Peinado y Estilizado',
      descripcion: 'Secado, planchado o peinado con productos fijadores para eventos especiales.',
      precio: 20000,
      duracion: 30,
      imagen: 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/20230729_225203-01.jpeg?alt=media&token=3f2e7913-8112-4963-9f42-7817a02ff826'
    }
  ];
  barberoSeleccionado: any = null;
  isCollapsed = false;
  serviciosSeleccionados: any[] = [];

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleServicio(servicio: any) {
    const index = this.serviciosSeleccionados.findIndex(
      (s) => s.nombre === servicio.nombre
    );

    if (index > -1) {
      // Ya está seleccionado → lo quitamos
      this.serviciosSeleccionados.splice(index, 1);
    } else {
      // No está seleccionado → lo agregamos
      this.serviciosSeleccionados.push(servicio);
    }
  }

  estaSeleccionado(servicio: any): boolean {
    return this.serviciosSeleccionados.some(
      (s) => s.nombre === servicio.nombre
    );
  }

  navigateToBarbers(){
    this.router.navigate(['/barbers']);
  }

  

  get totalServicios(): number {
    return this.serviciosSeleccionados.reduce(
      (total, s) => total + s.precio,
      0
    );
  }
}
