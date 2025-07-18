import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { DetailOrderComponent } from '../../components/detail-order/detail-order.component';

import { FormsModule } from '@angular/forms';
import { OrderStateService } from '../../../../utils/global/order-state.service';
import { FilterPipe } from '../../../../utils/pipes/filter.pipe';
import { SearchFilterComponent } from '../../../../shared/search-filter/search-filter.component';
import { HistorialForzadoService } from '../../../../utils/global/route-history.service';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { FooterComponent } from '../../../../shared/footer/footer.component';

@Component({
  selector: 'app-list-services',
  imports: [CommonModule, SteppersComponent,
    DetailOrderComponent, FormsModule,
    SearchFilterComponent, FilterPipe, FooterComponent],
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.css',
})
export class ListServicesComponent implements OnInit {
  public order = inject(OrderStateService);
  private readonly filterPipe = new FilterPipe();
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
  ];
  barberoSeleccionado: any = null;
  isCollapsed = false;
  filtroTexto = '';
  constructor(private historial: HistorialForzadoService) { }
  ngOnInit(): void {
    this.historial.forzarRegresoAHOME('/customer/list-services');
  }
  get quantityResults(): number {
    return this.filterPipe.transform(this.servicios, 'nombre', this.filtroTexto).length;
  }
  filterUpdate(text: string) {
    this.filtroTexto = text;
  }
  isSeleccionado(nombre: string): boolean {
    return this.order.serviciosSeleccionados().some(s => s.nombre === nombre);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleServicio(servicio: any) {
    this.order.toggleServicio(servicio);
  }

  get totalServicios(): number {
    return this.order.serviciosSeleccionados().reduce(
      (total, s) => total + s.precio,
      0
    );
  }


}
