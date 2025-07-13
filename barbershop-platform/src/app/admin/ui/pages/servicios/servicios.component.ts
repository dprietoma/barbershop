import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { TableComponent } from '../../../../shared/table/table.component';
import { ListService } from '../../../../services/listServices.service';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { ShowAlert } from '../../../../utils/global/sweetalert';
import { FormComponent } from '../../../../shared/form/form.component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-servicios',
  imports: [FooterComponent, TableComponent,
    FormComponent, BreadcrumbComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  breadcrumbRoutes = [
    { label: 'Panel de Administración', url: 'admin/dashboard' },
    { label: 'Nuestros Servicios', url: 'admin/servicios' },
  ];
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
  ListFormAppointments = [
    {
      title: 'Nombre Cliente',
      name: 'clienteNombre',
      type: 'text',
      placeholder: 'Nombre Completo',
      validation: [Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-person-circle icon-color fs-5',
      class: 'col-md-4'
    },
    {
      title: 'Celular',
      name: 'phoneCustomer',
      type: 'text',
      placeholder: 'Ingrese Celular',
      validation: [
        Validators.required,
        Validators.pattern(/^3\d{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
      icon: 'bi-telephone icon-color fs-5',
      class: 'col-md-4',
    },
    {
      title: 'Barbero',
      name: 'barberNombre',
      type: 'text',
      placeholder: 'Ingrese Barbero',
      validation: [Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-person-gear icon-color fs-5',
      class: 'col-md-4',
    },
    {
      title: 'Fecha',
      name: 'fecha',
      type: 'date',
      placeholder: 'Ingrese Fecha',
      validation: [Validators.required],
      icon: 'bi-calendar-event icon-color fs-5',
      class: 'col-md-4',
    },
    {
      title: 'Hora',
      name: 'hora',
      type: 'time',
      placeholder: 'Ingrese Hora',
      validation: [Validators.required],
      icon: 'bi-alarm icon-color fs-5',
      class: 'col-md-4',
    },
    {
      title: 'Estado',
      name: 'estado',
      type: 'select',
      placeholder: 'Seleccione Estado',
      validation: [Validators.required],
      icon: 'bi-list icon-color fs-5',
      class: 'col-md-4',
      options: [
        { label: 'Confirmada', value: 'Confirmada' },
        { label: 'En Curso', value: 'En Curso' },
      ]
    },
    {
      title: 'Total',
      name: 'total',
      type: 'currency',
      placeholder: 'Ingrese Total',
      validation: [Validators.required],
      icon: 'bi-cash-coin icon-color fs-5',
      class: 'col-md-4',
      mask: 'separator.0',
      prefix: '$ ',
      thousandSeparator: '.'
    },
  ];

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




  saveServices(event: any): void {
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


