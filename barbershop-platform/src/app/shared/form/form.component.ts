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
  selectedNetworks = new Set<string>();

  // mapa fijo para los controles de “cómo aparece”
  private socialMap: Record<string, string> = {
    face: 'user_face',
    whatsapp: 'user_whatsapp',
    insta: 'user_insta',
    tiktok: 'user_tiktok',
  };

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['IsEdit']) this.editMode = changes['IsEdit'].currentValue;

    // si cambia dataEdit y ya hay form, precargar redes
    if (changes['dataEdit'] && this.form) {
      this.preloadSocialFromEdit();
      // preview de foto en edición
      if (this.editMode) this.previewUrl = this.dataEdit?.foto ?? null;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.ListForms.forEach(input => {
      if (input.type === 'table') return;

      if (input.type === 'checkbox-group') {
        // si viene dataEdit.redes como array de objetos -> usamos los name
        const fromEdit = Array.isArray(this.dataEdit?.redes)
          ? this.dataEdit.redes.map((r: any) => r.name).filter(Boolean)
          : (this.dataEdit?.[input.name] ?? []);

        this.form.addControl(input.name, this.fb.control(fromEdit));
        (fromEdit as string[]).forEach(v => this.selectedNetworks.add(v));
        return;
      }

      const controlValue = input.type === 'file' ? null : '';
      const isDisabled = this.IsEdit && input.disabled;
      this.form.addControl(
        input.name,
        this.fb.control({ value: controlValue, disabled: !!isDisabled }, input.validation || [])
      );
    });

    // crear controles user_* si no existen
    this.ensureSocialControls();

    // preview y patch (evitando pisar redes)
    if (this.editMode) {
      this.previewUrl = this.dataEdit?.foto ?? null;

      // patch general (sin 'redes' porque aquí esperamos array de strings)
      const { redes: _omitRedes, ...rest } = this.dataEdit || {};
      this.form.patchValue(rest);
      this.form.get('foto')?.setValue(this.dataEdit?.foto ?? null);
    }

    // precargar valores de redes desde dataEdit.redes (array de objetos)
    this.preloadSocialFromEdit();

    // habilitar/deshabilitar campos user_* según selección inicial
    this.syncSocialControlsState();
  }

  // --------- UI auxiliares existentes ---------
  onClickSevice(key: string, row: any) {
    if (key === 'edit') {
      const existe = this.dataEdit.servicio?.some((s: any) => s.nombre === row.nombre);
      if (!existe) {
        this.dataEdit.total += row.valor;
        this.dataEdit.servicio?.push(row);
        this.form.patchValue({ total: this.dataEdit.total });
      }
    }
    if (key === 'delete') {
      this.dataEdit.total -= row.valor;
      this.dataEdit.servicio = this.dataEdit.servicio?.filter((s: any) => s.nombre !== row.nombre);
      this.form.patchValue({ total: this.dataEdit.total });
    }
  }

  isSelected(service: any): boolean {
    return this.dataEdit?.servicio?.some((s: any) => s.id === service.id);
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

  // --------- SUBMIT ---------
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const enabled = this.form.value;
    const raw = this.form.getRawValue();
    const hasCtrl = (name: string) => !!this.form.get(name);

    const result: any = {
      ...(this.dataEdit || {}),
      ...enabled,
    };

    if (hasCtrl('porcentaje')) {
      const parsePercent = (v: any): number | null => {
        if (v == null) return null;
        const num = Number(String(v).replace('%', '').trim());
        return isNaN(num) ? null : num;
      };
      result.porcentaje = enabled.porcentaje != null
        ? parsePercent(enabled.porcentaje)
        : (this.dataEdit?.porcentaje ?? null);
    }

    if (hasCtrl('redes')) {
      const selected = new Set<string>(enabled.redes || []);
      const prevArray: Array<{ name: string; valor: string }> =
        Array.isArray(this.dataEdit?.redes) ? [...this.dataEdit!.redes] : [];

      const prevMap = new Map<string, string>(prevArray.map(it => [it.name, it.valor]));

      for (const key of Object.keys(this.socialMap)) {
        const ctrlName = this.socialMap[key];
        if (!hasCtrl(ctrlName)) continue;

        if (selected.has(key)) {
          const valorActual = raw[ctrlName] ?? this.dataEdit?.[ctrlName] ?? '';
          prevMap.set(key, valorActual);
        }
        // si no está seleccionada, dejamos lo previo tal cual (no se pierde info)
      }

      const order = ['face', 'whatsapp', 'insta', 'tiktok'];
      const redesFinal: Array<{ name: string; valor: string }> = [];
      for (const name of order) {
        if (prevMap.has(name)) {
          redesFinal.push({ name, valor: String(prevMap.get(name) ?? '') });
        }
      }
      result.redes = redesFinal;

      // limpiar user_* del resultado para no duplicar
      for (const ctrl of Object.values(this.socialMap)) {
        if (result.hasOwnProperty(ctrl)) delete result[ctrl];
      }
    }

    this.formsValue.emit(result);
  }

  // --------- Redes: helpers ---------
  private ensureSocialControls() {
    for (const ctrl of Object.values(this.socialMap)) {
      if (!this.form.contains(ctrl)) {
        const initial = this.dataEdit?.[ctrl] ?? '';
        this.form.addControl(ctrl, this.fb.control(initial));
      }
    }
  }

  private preloadSocialFromEdit() {
    const redesCtrl = this.form.get('redes');
    if (!redesCtrl) return;

    // si dataEdit.redes existe, setear nombres y valores
    const prev: Array<{ name: string; valor: string }> =
      Array.isArray(this.dataEdit?.redes) ? this.dataEdit!.redes : [];

    const names = prev.map(r => r.name).filter(Boolean);
    redesCtrl.setValue(names, { emitEvent: false });

    this.selectedNetworks = new Set<string>(names);

    // asegurar controles y cargar valores
    this.ensureSocialControls();
    prev.forEach(r => {
      const ctrlName = this.socialMap[r.name];
      if (!ctrlName) return;
      const ctrl = this.form.get(ctrlName);
      if (ctrl) ctrl.setValue(r.valor ?? '', { emitEvent: false });
    });

    // habilitar/deshabilitar según selección
    this.syncSocialControlsState();
  }

  isNetworkSelected(key: string): boolean {
    return this.selectedNetworks.has(key);
  }

  onToggleNetwork(parent: any, key: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = !!target?.checked;

    const redesCtrl = this.form.get(parent.name);
    if (!redesCtrl) return;

    if (checked) this.selectedNetworks.add(key);
    else this.selectedNetworks.delete(key);

    redesCtrl.setValue(Array.from(this.selectedNetworks));
    redesCtrl.markAsDirty();

    const ctrlName = this.getCtrlNameByKey(key);
    const ctrl = this.form.get(ctrlName);
    if (!ctrl) return;

    if (checked) ctrl.enable({ emitEvent: false });
    else ctrl.disable({ emitEvent: false });
  }

  private syncSocialControlsState() {
    ['face', 'whatsapp', 'insta', 'tiktok'].forEach(key => {
      const ctrl = this.form.get(this.getCtrlNameByKey(key));
      if (!ctrl) return;
      if (this.selectedNetworks.has(key)) ctrl.enable({ emitEvent: false });
      else ctrl.disable({ emitEvent: false });
    });
  }

  private getCtrlNameByKey(key: string): string {
    return this.socialMap[key] ?? `user_${key}`;
  }
}
