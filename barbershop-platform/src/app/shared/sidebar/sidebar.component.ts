import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MODE_CONFIGS, ModeConfig } from '../../utils/interface/barberia-interface';
import { SessionStorageService } from '../../utils/global/StorageService ';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NavButtonsComponent } from '../../utils/nav-buttons/nav-buttons.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, NavButtonsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
titleTheme = 'Modo Oscuro';
  isDarkMode = false;
  isMenuOpen = false;
  mode: string | null = null;
  information: ModeConfig | null = null;
  private platformId = inject(PLATFORM_ID);
  constructor(private sessionStorage: SessionStorageService,
    private router: Router
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
  goToLogin() {
    this.router.navigate(['/admin/login']);
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
