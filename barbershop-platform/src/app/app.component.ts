import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { SessionStorageService } from './utils/global/StorageService ';
import { MODE_CONFIGS, ModeConfig } from './utils/interface/barberia-interface';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SpinnerComponent, SidebarComponent],
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'Customer';
    
}


