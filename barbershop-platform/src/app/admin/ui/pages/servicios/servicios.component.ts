import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { TableComponent } from '../../../../shared/table/table.component';
import { ListService } from '../../../../services/listServices.service';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { ShowAlert } from '../../../../utils/global/sweetalert';
import { FormComponent } from '../../../../shared/form/form.component';


@Component({
  selector: 'app-servicios',
  imports: [FooterComponent, TableComponent, FormComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  servicesData: any[] = [];
  uploading = false;

  cols = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'nombre', label: 'Nombre Servicio' },
    { key: 'valor', label: 'Valor', type: 'currency' },
    { key: 'detalle', label: 'Detalle' },
    { key: 'duracion', label: 'Duracion' },
  ];

  filtroConfig = {
    filterBy: 'nombre',
    placeholder: 'Buscar servicio...'
  };

  constructor(
    private listService: ListService, 
    private loadingService: LoadingService,) {

  }

  ngOnInit(): void {
    this.loadingService.show();
    this.listService.getAllServices().subscribe({
      next: (res) => {
        this.servicesData = res;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        ShowAlert.viewAlert('Oops...', 'Algo salio mal en la consulta', 'error');
      }
    });
  }




  guardarServicio(event: any): void {
    console.log(event);
   this.loadingService.show();
      this.listService.create(event).then(rs => {
        if (rs.ok) {
          ShowAlert.viewAlert('Perfecto...', rs.mensaje, 'success');
          this.listService.getAllServices().subscribe((res) => this.servicesData = res);
          this.loadingService.hide();
        } else {
          ShowAlert.viewAlert('Oops...', rs.mensaje, 'error');
          this.loadingService.hide();
        }
    });
  }


}


