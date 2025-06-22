import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  @Input() ListForms: any[] = [];
  @Output() formsValue = new EventEmitter<any>();
  form: FormGroup;
  imagenBase64: string = '';
  archivoSeleccionado!: File;
  previewUrl: string | null = null;

  constructor(private fb: FormBuilder) {
    // this.form = this.fb.group({
    //   nombre: ['', Validators.required],
    //   tipo: ['', Validators.required],
    //   detalle: [''],
    //   duracion: [''],
    //   valor: [''],
    //   avatar: [''],
    //   createdAt: [this.getFechaISO(), Validators.required],
    // });
  }
  ngOnInit(): void {
    this.form = this.fb.group({});
    this.ListForms.forEach(input => {
      const control = this.fb.control(
        { value: '', disabled: input.disabled || false },
        input.validation || []
      );
      this.form.addControl(input.name, control);
    });
  }

  getFechaISO(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16); // formato para datetime-local
  }

  triggerFileInput() {
    const input = document.getElementById('photoInput') as HTMLInputElement;
    input?.click();
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }



  // enviarFormulario() {
  //   if (this.form.valid) {
  //     this.onSubmit.emit({ ...this.form.value, createdAt: new Date() });
  //   }
  // }
  onSubmit(): void {
    if (this.form.valid) {
      this.formsValue.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
  // mostrarCampo(campo: string): boolean {
  //   return this.campos.includes(campo);
  // }
}
