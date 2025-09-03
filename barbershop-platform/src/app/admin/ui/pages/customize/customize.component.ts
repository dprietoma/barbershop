import { Component, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FormComponent } from '../../../../shared/form/form.component';
import { Validators } from '@angular/forms';
import { TableComponent } from '../../../../shared/table/table.component';
import { UploadfileService } from '../../../../services/fileUpload.services';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { Custom } from '../../../../utils/interface/custom-interface';
import { ListService } from '../../../../services/listServices.service';
import { ShowAlert } from '../../../../utils/global/sweetalert';
import { SUCCESS, SUCCESS_DELETE, SUCCESS_UPDATE } from '../../../../utils/constants/General-Constants';

@Component({
  selector: 'app-customize',
  imports: [BreadcrumbComponent, FooterComponent, FormComponent, TableComponent],
  templateUrl: './customize.component.html',
  styleUrl: './customize.component.css'
})
export class CustomizeComponent implements OnInit {
  private uploadfileService = inject(UploadfileService);
  private loadingService = inject(LoadingService);
  private listService = inject(ListService);

  breadcrumbRoutes = [
    { label: 'Panel de Administración', url: 'admin/dashboard' },
    { label: 'Personalizar', url: 'admin/custom' },
  ];
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
      title: 'Nombre Barberia',
      name: 'nombre',
      type: 'text',
      placeholder: 'Nombre Barberia',
      validation: [Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-house-gear icon-color fs-5',
      class: 'col-md-3'
    },
    {
      title: 'Tipo',
      name: 'tipo',
      type: 'select',
      placeholder: 'Seleccione Tipo',
      validation: [Validators.required],
      icon: 'bi-list icon-color fs-5',
      class: 'col-md-3',
      options: [
        { label: 'Cristian J Barberia', value: 'CRISTIANBARBER' },
        { label: 'Amate', value: 'AMATE' },
      ]
    },
    {
      title: 'Porcentaje Barberos',
      name: 'porcentaje',
      type: 'text',
      placeholder: 'Porcentaje',
      validation: [Validators.required, Validators.pattern(/^(100|[1-9][0-9]?)%$/)],
      icon: 'bi-house-gear icon-color fs-5',
      class: 'col-md-3'
    },
    {
      title: 'Eslogan',
      name: 'eslogan',
      type: 'text',
      placeholder: 'Eslogan',
      validation: [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-house-gear icon-color fs-5',
      class: 'col-md-3'
    },
    {
      title: 'Descripción',
      name: 'descripcion',
      type: 'textarea',
      placeholder: 'Escribe una reseña para tu barberia',
      validation: [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-house-gear icon-color fs-5',
      class: 'col-md-6'
    },
    {
      title: 'Redes sociales',
      name: 'redes',
      type: 'checkbox-group',
      placeholder: 'Selecciona tus redes',
      class: 'col-md-6',
      options: [
        { label: 'Facebook', value: 'face' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Instagram', value: 'insta' },
        { label: 'TikTok', value: 'tiktok' },
      ]
    }

  ]
  cols = [
    { key: 'foto', label: 'Avatar', type: 'avatar' },
    { key: 'nombre', label: 'Nombre Barberia' },
    { key: 'porcentaje', label: 'Porcentaje Barbero' },
    { key: 'tipo', label: 'Tipo' },
    { key: '', label: '', type: 'actions' },
  ];
  filtroConfig = {
    filterBy: 'nombre',
    placeholder: 'Buscar Configuración...'
  };
  servicesData: any[] = [];

  ngOnInit(): void {
    this.getCustom();
  }
  async saveCustom(event: any) {
    this.loadingService.show();
    try {
      const urlFoto = await this.uploadFile(event.foto);
      const data: Custom = {
        id: this.generarIdAleatorio(),
        nombre: event.nombre,
        foto: urlFoto,
        porcentaje: event.porcentaje,
        tipo: event.tipo,
        descripcion: event.descripcion,
        eslogan: event.eslogan,
        redes: event.redes
      };
      debugger;
      await this.listService.createCustom(data as any);
      ShowAlert.viewAlert('info', SUCCESS, 'success');
      this.getCustom();
    } catch (error) {
      console.error('Error creando el servicio', error);
    } finally {
      this.loadingService.hide();
    }
  }
  async uploadFile(file: any): Promise<string> {
    return this.uploadfileService.uploadFile(file, 'services')
      .then((url: any) => {
        return url;
      })
      .catch(err => {
        console.error('Error subiendo imagen:', err);
        throw err;
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
  async editCustom(event: any) {
    this.loadingService.show();
    try {
      let urlFoto = event.foto instanceof File
        ? await this.uploadFile(event.foto)
        : event.foto;
      const data: Custom = {
        id: event.id,
        nombre: event.nombre,
        foto: urlFoto,
        porcentaje: event.porcentaje,
        tipo: event.tipo,
        descripcion: event.descripcion,
        eslogan: event.eslogan,
        redes: event.redes
      };
      await this.listService.updateCustom(data.id as any, data);
      ShowAlert.viewAlert('info', SUCCESS_UPDATE, 'success');
      this.getCustom();
    } catch (error) {
      console.error('Error editando personalización', error);
    } finally {
      this.loadingService.hide();
    }
  }
  onClick(event: any) {
    if (event.action === 'delete') {
      this.deleteCustom(event.row.id as any);
    }
  }
  async deleteCustom(id: string) {
    this.loadingService.show()
    try {
      await this.listService.deleteCustomById(id);
      ShowAlert.viewAlert('info', SUCCESS_DELETE, 'success');
      this.getCustom();
    } catch (error) {
      console.error('Error eliminando configuración', error);
    } finally {
      this.loadingService.hide();
    }
  }

  getCustom() {
    this.loadingService.show();
    this.listService.getCustom().subscribe({
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
}
