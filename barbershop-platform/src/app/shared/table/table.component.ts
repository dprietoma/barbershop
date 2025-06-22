import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../../utils/pipes/filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMaskDirective } from 'ngx-mask';
@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule, FilterPipe, NgxPaginationModule,
    ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string, type?: string }[] = [];
  @Input() showInputFilter: boolean = false;
  @Input() configFilter: { filterBy: string; placeholder: string } = {
    filterBy: '',
    placeholder: ''
  };
  @Input() nameTable: string = '';
  @Output() selectItem = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string, row: any }>();
  @Input() ListForms: any[] = [];
  @Output() formsValue = new EventEmitter<any>();
  form: FormGroup;
  selectedItem: any = null;
  showModal: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filtroTexto = '';
  p: number = 1;

  private readonly filterPipe = new FilterPipe();
  constructor(private fb: FormBuilder) { }
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
  onRowClick(row: any) {
    this.selectedItem = row;
    this.selectItem.emit(row);
  }
  onIconClick(action: string, row: any) {
    this.actionClick.emit({ action, row });
    if (action === 'edit') {
      this.selectedItem = row;
      this.form.patchValue(this.selectedItem, { onlySelf: false, emitEvent: true });
      this.showModal = true;
    }
  }
  hasActionsColumn(): boolean {
    return this.columns.some(c => c.type === 'actions');
  }
  closeModal() {
    this.showModal = false;
  }
  get sortedData() {
    if (!this.sortColumn) return this.data;
    return [...this.data].sort((a, b) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];
      const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }


  get quantityResults(): number {
    return this.filterPipe.transform(this.sortedData, this.configFilter.filterBy, this.filtroTexto).length;
  }
  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Confirmada':
        return 'bg-success';
      case 'En Curso':
        return 'bg-warning text-dark';
      case 'Finalizada':
        return 'bg-primary';
      case 'Cancelada':
        return 'bg-danger';
      default:
        return 'bg-secondary';
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
