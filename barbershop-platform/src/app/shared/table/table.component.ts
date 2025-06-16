import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string, type?: string }[] = [];
  @Output() selectItem = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string, row: any }>();
  selectedItem: any = null;
  showModal: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}
