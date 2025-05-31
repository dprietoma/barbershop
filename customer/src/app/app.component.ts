import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './ui/shared/spinner/spinner.component';
import { SessionStorageService } from './ui/utils/global/StorageService ';
import { AMATE, CRISTIANJBARBER } from './ui/utils/constants/General-Constants';
import { MODE_CONFIGS, ModeConfig } from './ui/utils/interface/barberia-interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SpinnerComponent],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Customer';
  titleTheme = 'Modo Oscuro';
  isDarkMode = false;
  isMenuOpen = false;
  mode: string | null = null;
  information: ModeConfig | null = null;
  private platformId = inject(PLATFORM_ID);
  constructor(private sessionStorage: SessionStorageService
  ) { }
  ngOnInit() {
    this.sessionStorage.mode$.subscribe((mode: any) => {
      this.mode = mode;
      this.information = mode ? MODE_CONFIGS[mode] ?? null : null;
      this.loadTheme();
    });
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = !this.isDarkMode;
      const body = document.body;
      if (this.isDarkMode) {
        this.titleTheme = "Modo Claro";
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        this.sessionStorage.saveType('theme', 'dark');
      } else {
        this.titleTheme = "Modo Oscuro";
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        this.sessionStorage.saveType('theme', 'light');
      }
    }
  }

  loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const theme = this.sessionStorage.getType('theme');
      const body = document.body;
      if (theme === 'dark') {
        this.isDarkMode = true;
        this.titleTheme = 'Modo Claro';
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        this.isDarkMode = false;
        this.titleTheme = 'Modo Oscuro';
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
      }
    }
  }
}


