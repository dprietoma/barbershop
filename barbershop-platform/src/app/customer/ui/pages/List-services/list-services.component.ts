import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SteppersComponent } from '../../components/steppers/steppers.component';
import { DetailOrderComponent } from '../../components/detail-order/detail-order.component';
import { FormsModule } from '@angular/forms';
import { OrderStateService } from '../../../../utils/global/order-state.service';
import { FilterPipe } from '../../../../utils/pipes/filter.pipe';
import { SearchFilterComponent } from '../../../../shared/search-filter/search-filter.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { ShowAlert } from '../../../../utils/global/sweetalert';
import { ListService } from '../../../../services/listServices.service';

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
  private listService = inject(ListService);
  private readonly filterPipe = new FilterPipe();
  servicios: any[] = [];
  barberoSeleccionado: any = null;
  isCollapsed = false;
  filtroTexto = '';
  constructor(private loadingService: LoadingService) { }
  ngOnInit(): void {
    this.getServices();
  }
  getServices() {
    this.loadingService.show();
    this.listService.getAllServices().subscribe({
      next: (res) => {
        this.servicios = res;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        ShowAlert.viewAlert('Oops...', 'Algo salio mal en la consulta', 'error');
      }
    });
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
      (total, s) => total + s.valor,
      0
    );
  }


}
