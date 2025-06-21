import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MODE_CONFIGS, ModeConfig } from '../../utils/interface/barberia-interface';
import { SessionStorageService } from '../../utils/global/StorageService ';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavButtonsComponent } from '../../utils/nav-buttons/nav-buttons.component';
import { MENU_BY_ROLE } from '../../utils/constants/menu-config';
import { Users } from '../../utils/interface/users-interface';
import { AuthenticationService } from '../../services/authentication.services';
import Swal from 'sweetalert2';
import { INTERNALCODE } from '../../utils/constants/General-Constants';
import { AppSignalService } from '../../services/signals.service';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, NavButtonsComponent, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  titleTheme = 'Modo Oscuro';
  isDarkMode = false;
  isMenuOpen = false;
  mode: string | null = null;
  information: ModeConfig | null = null;
  menuItems: any[] = [];
  user: Users | null = null;
  private platformId = inject(PLATFORM_ID);
  constructor(private sessionStorage: SessionStorageService,
    private router: Router,
    private authService: AuthenticationService,
    private appSignal: AppSignalService
  ) { }
  ngOnInit() {
    this.sessionStorage.mode$.subscribe((mode: any) => {
      this.mode = mode;
      this.information = mode ? MODE_CONFIGS[mode] ?? null : null;
      this.loadTheme();
      this.menuItems = MENU_BY_ROLE['admin'];
    });
    this.sessionStorage.user$.subscribe(userStr => {
      if (userStr) {
        // this.loadMenus();
      }
    });
  }
  loadMenus(): void {
    try {
      const userData = this.sessionStorage.getType('user');
      if (userData) {
        this.user = JSON.parse(userData) as Users;
        this.menuItems = MENU_BY_ROLE[this.user.role] || [];
      }
    } catch {
      this.menuItems = [];
    }
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
        this.appSignal.set({ tipo: 'tema', valor: 'dark' });
      } else {
        this.titleTheme = "Modo Oscuro";
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        this.sessionStorage.saveType('theme', 'light');
        this.appSignal.set({ tipo: 'tema', valor: 'light' });
      }
    }
  }
  goToLogin() {
    this.showKeyPrompt();
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

  logout() {
    this.authService.logout().then(() => {
      this.user = null;
      this.menuItems = [];
      this.router.navigate(['/customer/location']);
    });
  }
  async showKeyPrompt() {
    const { value: key } = await Swal.fire({
      title: 'Acceso restringido',
      input: 'password',
      inputLabel: 'Ingresa la llave secreta',
      inputPlaceholder: '********',
      inputAttributes: {
        maxlength: '20',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Ingresar',
      cancelButtonText: 'Cancelar'
    });
    if (key) {
      if (key?.toLowerCase() === INTERNALCODE.toLowerCase()) {
        this.router.navigate(['/admin/login']);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Llave incorrecta',
          text: 'La clave que ingresaste no es válida.',
        });
      }
    }
  }

}
