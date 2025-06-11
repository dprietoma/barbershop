import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { MODE_CONFIGS, ModeConfig } from '../../../../utils/interface/barberia-interface';


@Component({
  selector: 'app-info-barbershop',
  standalone: true,
  imports: [],
  templateUrl: './info-barbershop.component.html',
  styleUrl: './info-barbershop.component.css'
})
export class InfoBarbershopComponent implements OnInit {
  mode: string | null = null;
  information: ModeConfig | null = null;
  constructor(private router: Router, private sessionStorage: SessionStorageService) {}
  ngOnInit(): void {
    this.mode = this.sessionStorage.getType('mode');
    this.information = this.mode ? MODE_CONFIGS[this.mode] ?? null : null;
  }
  navigateToServices() {
    this.router.navigate(['/customer/list-services']);
  }
}
