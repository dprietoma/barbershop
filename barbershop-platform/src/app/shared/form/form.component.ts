import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  @Input() campos: string[] = [];
  @Output() onSubmit = new EventEmitter<any>();

  form: FormGroup;
  imagenBase64: string = '';
  archivoSeleccionado!: File;
  imagenPreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      detalle: [''],
      duracion: [''],
      valor: [''],
      avatar: [''],
      createdAt: [this.getFechaISO(), Validators.required],
    });
  }

  getFechaISO(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16); // formato para datetime-local
  }

  subirImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      const reader = new FileReader();
      reader.onload = () => this.imagenPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  

  enviarFormulario() {
    if (this.form.valid) {
      this.onSubmit.emit({ ...this.form.value, createdAt: new Date() });
    }
  }

  mostrarCampo(campo: string): boolean {
    return this.campos.includes(campo);
  }
}
