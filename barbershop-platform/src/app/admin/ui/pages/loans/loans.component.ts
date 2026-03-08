import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { FormComponent } from '../../../../shared/form/form.component';
import { TableComponent } from '../../../../shared/table/table.component';
import { BarberosService } from '../../../../services/barberos.service';
import { ShowAlert } from '../../../../utils/global/sweetalert';
import { SUCCESS, SUCCESS_DELETE, SUCCESS_UPDATE } from '../../../../utils/constants/General-Constants';
import { LoadingService } from '../../../../utils/global/LoadingService';
@Component({
  selector: 'app-loans',
  imports: [CommonModule, ReactiveFormsModule, FooterComponent,
    BreadcrumbComponent, FormComponent, TableComponent
  ],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css'
})
export class LoansComponent implements OnInit {
  private barberService = inject(BarberosService);
  prestamoForm: FormGroup;
  prestamos: any[] = [];
  private loadingService = inject(LoadingService);
  breadcrumbRoutes = [
    { label: 'Panel de Administración', url: 'admin/dashboard' },
    { label: 'Prestamos', url: 'admin/loans' },
  ];
  filtroConfig = {
    filterBy: 'nombre',
    placeholder: 'Buscar barbero...'
  };
  cols = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'detalle', label: 'Detalle' },
    { key: 'valor', label: 'Valor', type: 'currency' },
    { key: '', label: '', type: 'actions' },
  ];
  ListFormCollaborators = [
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
      title: 'Valor',
      name: 'valor',
      type: 'currency',
      placeholder: 'Valor del prestamo',
      validation: [Validators.required],
      icon: 'bi-cash-coin icon-color fs-5',
      class: 'col-md-4',
      mask: 'separator.0',
      prefix: '$ ',
      thousandSeparator: '.'
    },
    {
      title: 'Tipo',
      name: 'tipo',
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
      title: 'Estado',
      name: 'estado',
      type: 'select',
      placeholder: 'Seleccione estado',
      validation: [Validators.required],
      icon: 'bi-list icon-color fs-5',
      class: 'col-md-4',
      options: [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Pagado', value: 'PAGADO' },
      ]
    },
    {
      title: 'Detalle',
      name: 'detalle',
      type: 'textarea',
      placeholder: 'Detalle del prestamo',
      validation: [Validators.required],
      icon: 'bi-person-circle icon-color fs-5',
      class: 'col-md-4'
    }


  ];
  ngOnInit(): void {
    this.getLoans();
  }
  constructor(private fb: FormBuilder) {
    this.prestamoForm = this.fb.group({
      barbero: ['', Validators.required],
      valor: [null, [Validators.required, Validators.min(1000)]],
      fecha: ['', Validators.required],
      observacion: ['']
    });
  }
  getLoans() {
    this.barberService.getLoans().subscribe(data => {
      this.prestamos = data;
    });
  }
  async saveCollaborators(event: any) {
    this.loadingService.show();
    try {
      await this.barberService.saveLoan(event);
      ShowAlert.viewAlert('info', SUCCESS, 'success');
      this.getLoans();
    } catch (error) {
      console.error('Error creando prestamo', error);
    } finally {
      this.loadingService.hide();
    }
  }
  async editCollaborators(event: any) {
    this.loadingService.show();
    try {
      await this.barberService.updateLoans(event.id, event);
      ShowAlert.viewAlert('info', SUCCESS_UPDATE, 'success');
      this.getLoans();
    } catch (error) {
      console.error('Error actualizando prestamo', error);
    } finally {
      this.loadingService.hide();
    }
  }

  async deleteLoasn(id: string) {
    this.loadingService.show();
    try {
      await this.barberService.deleteLoans(id);
      ShowAlert.viewAlert('info', SUCCESS_DELETE, 'success');
      this.getLoans();
    } catch (error) {
      console.error('Error eliminando prestamo', error);
    } finally {
      this.loadingService.hide();
    }

  }
  onClick(event: any) {
    if (event.action === 'delete') {
      this.deleteLoasn(event.row.id as any);
    }
  }
}
