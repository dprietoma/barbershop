import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { TableComponent } from '../../../../shared/table/table.component';
import { ListService } from '../../../../services/listServices.service';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-servicios',
  imports: [FooterComponent,TableComponent,ReactiveFormsModule ],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  servicesData: any[] = [];
  formServicio: FormGroup;

cols = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'nombre', label: 'Nombre Servicio' },
    { key: 'valor', label: 'Valor',  type: 'currency' },
    { key: 'detalle', label: 'Detalle' },
    { key: 'duracion', label: 'Duracion' },
  ];

filtroConfig = {
    filterBy: 'nombre',
    placeholder: 'Buscar servicio...'
};

constructor(private listService:ListService,private loadingService: LoadingService,private fb: FormBuilder){

}
  
ngOnInit(): void {
  this.loadingService.show();
  this.listService.getAllServices().subscribe({
    next:(res) => {
      this.servicesData = res;
      this.loadingService.hide();
    },
    error: (err) => {
      this.loadingService.hide();
      console.error('Error al cargar servicios:', err);
    }
  });
  this.initForm();
}

initForm(){
   this.formServicio = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      duracion: ['', Validators.required],
      valor: [null, [Validators.required, Validators.min(0)]],
      detalle: ['', Validators.required],
      avatar: ['', Validators.required],
      createdAt: [this.getFechaISO(), Validators.required],
    });
}

 getFechaISO(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16); // formato para datetime-local
  }

    guardarServicio(): void {
    if (this.formServicio.valid) {
      const data = this.formServicio.value;
      console.log('Servicio a guardar:', data);
      // Aquí puedes conectarte a tu backend o Firebase
    }
  }

}


