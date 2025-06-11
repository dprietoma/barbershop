import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../utils/global/LoadingService';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  loading$!: Observable<boolean>;
  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
