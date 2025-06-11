import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent {
  filtroTexto: string = '';
  @Output() changeText = new EventEmitter<string>();
  @Input() quantityResults: number = 0;
  @Input() placeHolder: string = '';

  emitChange() {
    this.changeText.emit(this.filtroTexto);
  }
}
