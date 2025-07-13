import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { FormsModule, Validators } from '@angular/forms';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FormComponent } from '../../../../shared/form/form.component';
import { TableComponent } from '../../../../shared/table/table.component';
import { BarberosService } from '../../../../services/barberos.service';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { Barbero } from '../../../../utils/interface/barbero-interface';
import { UploadfileService } from '../../../../services/fileUpload.services';
import { ShowAlert } from '../../../../utils/global/sweetalert';
import { SUCCESS, SUCCESS_DELETE } from '../../../../utils/constants/General-Constants';

@Component({
  selector: 'app-collaborators',
  imports: [CommonModule, BreadcrumbComponent,
    FormsModule, FooterComponent, FormComponent, TableComponent],
  templateUrl: './collaborators.component.html',
  styleUrl: './collaborators.component.css'
})
export class CollaboratorsComponent implements OnInit {
  breadcrumbRoutes = [
    { label: 'Panel de Administración', url: 'admin/dashboard' },
    { label: 'Colaboradores', url: 'admin/collaborators' },
  ];
  cols = [
    { key: 'foto', label: 'Avatar', type: 'avatar' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'numDoc', label: 'Documento' },
    { key: 'numCelular', label: 'Celular', type: 'phone' },
    { key: 'rating', label: 'Calificación', type: 'raiting' },
    { key: '', label: '', type: 'actions' },
  ];
  ListFormCollaborators = [
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
      title: 'Nombre Barbero',
      name: 'nombre',
      type: 'text',
      placeholder: 'Nombre Completo',
      validation: [Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)],
      icon: 'bi-person-circle icon-color fs-5',
      class: 'col-md-4'
    },
    {
      title: 'Celular',
      name: 'numCelular',
      type: 'text',
      placeholder: 'Ingrese Celular',
      validation: [
        Validators.required,
        Validators.pattern(/^3\d{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
      icon: 'bi-telephone icon-color fs-5',
      class: 'col-md-3',

    },
    {
      title: 'Calificación',
      name: 'rating',
      type: 'text',
      placeholder: 'Calificación',
      validation: [Validators.required,
      Validators.pattern(/^([1-4](\.[0-9])?|5(\.0)?)$/)],
      icon: 'bi-star-half icon-color fs-5',
      class: 'col-md-2',
    },
    {
      title: 'Estado',
      name: 'activo',
      type: 'select',
      placeholder: 'Seleccione Estado',
      validation: [Validators.required],
      icon: 'bi-list icon-color fs-5',
      class: 'col-md-3',
      options: [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false },
      ]
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
    {
      title: 'Tipo Documento',
      name: 'typeDoc',
      type: 'select',
      placeholder: 'Seleccione Documento',
      validation: [Validators.required],
      icon: 'bi-list icon-color fs-5',
      class: 'col-md-4',
      options: [
        { label: 'Cédula de ciudadanía', value: 'CC' },
        { label: 'Cédula de extranjería', value: 'CE' },
        { label: 'Tarjeta de identidad', value: 'TI' },
        { label: 'Pasaporte', value: 'PAS' }
      ]
    },
    {
      title: 'Número Documento',
      name: 'numDoc',
      type: 'text',
      placeholder: 'Ingrese Documento',
      validation: [
        Validators.required,
        Validators.pattern(/^\d{7,10}$/),
        Validators.minLength(7),
        Validators.maxLength(10),
      ],
      icon: 'bi-person-vcard icon-color fs-5',
      class: 'col-md-3',
    }
  ];
  filtroConfig = {
    filterBy: 'nombre',
    placeholder: 'Buscar Colaborador...'
  };
  mode: string | null = null;
  private barberService = inject(BarberosService);
  private loadingService = inject(LoadingService);
  barberos: Barbero[] = [];
  constructor(private uploadfileService: UploadfileService) { }
  ngOnInit(): void {
    this.getBarber();
  }
  async saveCollaborators(event: Barbero) {
    this.loadingService.show();
    try {
      const urlFoto = await this.uploadFile(event.foto);
      const data: Barbero = {
        id: `${event.typeDoc}${event.numDoc}`,
        activo: Boolean(event.activo),
        nombre: event.nombre,
        numCelular: `+57${event.numCelular}`,
        typeDoc: event.typeDoc,
        numDoc: event.numDoc,
        type: event.type,
        rating: Number(event.rating),
        foto: urlFoto,
        especialidades: [],
        insta: ''
      };
      await this.barberService.createBarber(data);
      ShowAlert.viewAlert('info', SUCCESS, 'success');
      this.getBarber();
    } catch (error) {
      console.error('Error creando barbero', error);
    } finally {
      this.loadingService.hide();
    }
  }
  onClick(event: any) {
    if (event.action === 'delete') {
      this.deleteBarber(event.row.id as any)
    }
  }
  async deleteBarber(id: string) {
    this.loadingService.show()
    try {
      await this.barberService.deleteBarberById(id);
      ShowAlert.viewAlert('info', SUCCESS_DELETE, 'success');
      this.getBarber();
    } catch (error) {
      console.error('Error eliminando barbero', error);
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

  getBarber() {
    this.loadingService.show();
    this.barberService.GetBarbersByType('all').subscribe(data => {
      this.barberos = data;
      console.log(this.barberos)
      this.loadingService.hide();
    });
  }
}
