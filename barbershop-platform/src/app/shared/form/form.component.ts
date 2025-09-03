import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit, OnChanges {

  @Input() ListForms: any[] = [];
  @Input() IsEdit: boolean = false;
  @Input() dataEdit: any;
  @Output() formsValue = new EventEmitter<any>();
  form: FormGroup;
  previewUrl: string | null = null;
  editMode: boolean = false;

  constructor(private fb: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['IsEdit']) {
      this.editMode = changes['IsEdit'].currentValue;
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({});
    this.ListForms.forEach(input => {
      if (input.type === 'table') {
        return;
      }
      const controlValue = input.type === 'file' ? null : '';
      const isDisabled = this.IsEdit && input.disabled;
      const control = this.fb.control(
        { value: controlValue, disabled: isDisabled || false },
        input.validation || []
      );
      this.form.addControl(input.name, control);
    });
    if (this.editMode) {
      this.previewUrl = this.dataEdit?.foto;
      this.form.patchValue(this.dataEdit);
      this.form.get('foto')?.setValue(this.dataEdit.foto);
    }
  }
  onClickSevice(key: string, row: any) {
    if (key === 'edit') {
      const existe = this.dataEdit.servicio?.some((s: any) => s.nombre === row.nombre);
      if (!existe) {
        this.dataEdit.total += row.valor;
        this.dataEdit.servicio?.push(row);
        this.form.patchValue({
          total: this.dataEdit.total,
        });
      }
    }
    if (key === 'delete') {
      this.dataEdit.total -= row.valor;
      this.dataEdit.servicio = this.dataEdit.servicio?.filter((s: any) => s.nombre !== row.nombre);
      this.form.patchValue({
        total: this.dataEdit.total,
      });
    }

  }
  isSelected(service: any): boolean {
    return this.dataEdit?.servicio?.some(
      (s: any) => s.id === service.id
    );
  }

  triggerFileInput() {
    const input = document.getElementById(this.editMode ? 'photoInputEdit' : 'photoInput') as HTMLInputElement;
    input?.click();
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.form.get('foto')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      const mergedValues = this.dataEdit
        ? { ...this.dataEdit, ...formValues }
        : { ...formValues };
      this.formsValue.emit(mergedValues);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
