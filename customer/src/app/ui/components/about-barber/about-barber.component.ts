import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../utils/global/StorageService ';
import { MODE_CONFIGS, ModeConfig } from '../../utils/interface/barberia-interface';

@Component({
  selector: 'app-about-barber',
  imports: [],
  templateUrl: './about-barber.component.html',
  styleUrl: './about-barber.component.css'
})
export class AboutBarberComponent implements OnInit {
  mode: string | null = null;
  information: ModeConfig | null = null;
  constructor(private sessionStorage: SessionStorageService) { }
  ngOnInit(): void {
    this.mode = this.sessionStorage.getType('mode');
    this.information = this.mode ? MODE_CONFIGS[this.mode] ?? null : null;
  }

}
