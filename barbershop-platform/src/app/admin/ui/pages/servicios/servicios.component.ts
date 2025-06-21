import { Component } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { TableComponent } from '../../../../shared/table/table.component';

@Component({
  selector: 'app-servicios',
  imports: [FooterComponent,TableComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
servicesData = [
   {
    avatar: 'https://tu-url.com/avatar.jpg',
    createdAt: '2025-06-16T18:51:43-05:00',
    detalle: 'Incluye. El Servicio de corte premium y el servicio de barba básico.',
    duracion: '1 hora 15 minutos',
    nombre: 'Corte premium y barba básico',
    tipo: 'CRISTIANBARBER',
    valor: '30000'
  }
]
cols = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'nombre', label: 'Nombre Servicio' },
    { key: 'valor', label: 'Valor',  type: 'currency' },
    { key: 'detalle', label: 'Detalle' },
    { key: 'duracion', label: 'Duracion' },
  ];
}
