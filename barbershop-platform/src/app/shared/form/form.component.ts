import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { isEmpty } from 'rxjs';
import { json } from 'stream/consumers';

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
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['IsEdit']) {
      this.editMode = changes['IsEdit'].currentValue;
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({});
    this.ListForms.forEach(input => {
      const controlValue = input.type === 'file' ? null : '';
      this.form.addControl(input.name, this.fb.control(controlValue, input.validation || []));
    });

    if (this.editMode) {
      this.previewUrl = this.dataEdit?.foto;
      const dataEditCopy = { ...this.dataEdit };
      delete dataEditCopy.foto;
      this.form.patchValue(dataEditCopy);
    }
  }



  getFechaISO(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
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
      this.formsValue.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
