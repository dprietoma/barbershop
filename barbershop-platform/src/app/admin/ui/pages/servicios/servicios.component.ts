import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { TableComponent } from '../../../../shared/table/table.component';
import { ListService } from '../../../../services/listServices.service';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { ShowAlert } from '../../../../utils/global/sweetalert';
import { FormComponent } from '../../../../shared/form/form.component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { Validators } from '@angular/forms';
import { Servicios } from '../../../../utils/interface/servicios-interface';
import { UploadfileService } from '../../../../services/fileUpload.services';
import { SUCCESS, SUCCESS_DELETE, SUCCESS_UPDATE } from '../../../../utils/constants/General-Constants';
import { Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-servicios',
  imports: [FooterComponent, TableComponent,
    FormComponent, BreadcrumbComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  private uploadfileService = inject(UploadfileService);
  private listService = inject(ListService);
  private loadingService = inject(LoadingService);

  // Variables
  servicesData: any[] = [];
  uploading = false;
  fechaActual = Timestamp.fromDate(new Date())



  breadcrumbRoutes = [
    { label: 'Panel de Administración', url: 'admin/dashboard' },
    { label: 'Nuestros Servicios', url: 'admin/servicios' },
  ];
  cols = [
    { key: 'foto', label: 'Avatar', type: 'avatar' },
    { key: 'nombre', label: 'Nombre Servicio' },
    { key: 'valor', label: 'Valor', type: 'currency' },
    { key: 'detalle', label: 'Detalle' },
    { key: 'duracion', label: 'Duracion' },
    { key: '', label: '', type: 'actions' },
  ];

  filtroConfig = {
    filterBy: 'nombre',
    placeholder: 'Buscar servicio...'
  };
  ListFormAppointments = [
    {
      title: 'Foto',
      name: 'foto',
      type: 'file',
      placeholder: 'Agrega una foto',
      validation: [Validators.required],
      icon: 'bi-camera icon-color fs-5',
      class: 'col-md-12 text-center'
    },
    {
      title: 'Nombre Servicio',
      name: 'nombre',
      type: 'text',
      placeholder: 'Nombre Servicio',
      validation: [Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-emoji-laughing icon-color fs-5',
      class: 'col-md-4'
    },
    {
      title: 'Detalle',
      name: 'detalle',
      type: 'text',
      placeholder: 'Detalle Servicio',
      validation: [Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-ticket-detailed icon-color fs-5',
      class: 'col-md-4'
    },
    {
      title: 'Duración Servicio',
      name: 'duracion',
      type: 'text',
      placeholder: 'Duración del servicio',
      validation: [Validators.required],
      icon: 'bi-ticket-detailed icon-color fs-5',
      class: 'col-md-4'
    },
    {
      title: 'Valor',
      name: 'valor',
      type: 'currency',
      placeholder: 'Valor del servicio',
      validation: [Validators.required],
      icon: 'bi-cash-coin icon-color fs-5',
      class: 'col-md-4',
      mask: 'separator.0',
      prefix: '$ ',
      thousandSeparator: '.'
    },
    {
      title: 'Tipo',
      name: 'type',
      type: 'select',
      placeholder: 'Seleccione Tipo',
      validation: [Validators.required],
      icon: 'bi-list icon-color fs-5',
      class: 'col-md-4',
      options: [
        { label: 'Cristian J Barberia', value: 'CRISTIANBARBER' },
        { label: 'Amate', value: 'AMATE' },
      ]
    },
  ];

  constructor() { }

  ngOnInit(): void {
    this.getServices();
  }




  async saveServices(event: Servicios) {
    debugger;
    this.loadingService.show();
    try {
      const urlFoto = await this.uploadFile(event.foto);
      const data: Servicios = {
        id: this.generarIdAleatorio(),
        nombre: event.nombre,
        foto: urlFoto,
        detalle: event.detalle,
        duracion: event.duracion,
        valor: event.valor,
        type: event.type,
        fecha: this.fechaActual,

      };
      await this.listService.createServicio(data);
      ShowAlert.viewAlert('info', SUCCESS, 'success');
      this.getServices();
    } catch (error) {
      console.error('Error creando el servicio', error);
    } finally {
      this.loadingService.hide();
    }
  }

  async uploadFile(file: any): Promise<string> {
    return this.uploadfileService.uploadFile(file)
      .then((url: any) => {
        return url;
      })
      .catch(err => {
        console.error('Error subiendo imagen:', err);
        throw err;
      });
  }

  onClick(event: any) {
    if (event.action === 'delete') {
      this.deleteServices(event.row.id as any)
    }
  }
  async editServices(event: any) {
    this.loadingService.show();
    try {
      let urlFoto = event.foto instanceof File
        ? await this.uploadFile(event.foto)
        : event.foto;
      const data: Servicios = {
        id: event.id,
        nombre: event.nombre,
        foto: urlFoto,
        detalle: event.detalle,
        duracion: event.duracion,
        valor: event.valor,
        type: event.type,
        fecha: this.fechaActual,
      };
      await this.listService.updateServices(data.id, data);
      ShowAlert.viewAlert('info', SUCCESS_UPDATE, 'success');
      this.getServices();
    } catch (error) {
      console.error('Error editando servicio', error);
    } finally {
      this.loadingService.hide();
    }
  }


  async deleteServices(id: string) {
    this.loadingService.show()
    try {
      await this.listService.deleteServById(id);
      ShowAlert.viewAlert('info', SUCCESS_DELETE, 'success');
      this.getServices();
    } catch (error) {
      console.error('Error eliminando barbero', error);
    } finally {
      this.loadingService.hide();
    }
  }


  getServices() {
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

  generarIdAleatorio(longitud: number = 20): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';

    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indice);
    }

    return resultado;
  }




}


