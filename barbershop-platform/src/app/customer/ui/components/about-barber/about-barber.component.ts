import { Component, OnInit } from '@angular/core';
import { MODE_CONFIGS, ModeConfig } from '../../../../utils/interface/barberia-interface';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-about-barber',
  imports: [],
  templateUrl: './about-barber.component.html',
  styleUrl: './about-barber.component.css'
})
export class AboutBarberComponent implements OnInit {
  mode: string | null = null;
  information: ModeConfig | null = null;
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  constructor(private sessionStorage: SessionStorageService) { }
  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.mode = this.sessionStorage.getType('mode');
    this.information = this.mode ? MODE_CONFIGS[this.mode] ?? null : null;
  }

}
