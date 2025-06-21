import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../utils/pipes/filter.pipe';

@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
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
  selectedItem: any = null;
  showModal: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filtroTexto = '';

  private readonly filterPipe = new FilterPipe();
  onRowClick(row: any) {
    this.selectedItem = row;
    this.selectItem.emit(row);
  }
  onIconClick(action: string, row: any) {
    this.actionClick.emit({ action, row });
    if (action === 'edit') {
      this.selectedItem = row;
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
}
