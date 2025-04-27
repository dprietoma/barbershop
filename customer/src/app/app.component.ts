import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Customer';
  titleTheme = 'Modo Oscuro'
  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const body = document.body;

    if (this.isDarkMode) {
      this.titleTheme = "Modo Claro"
      body.classList.add('dark-theme');
    } else {
      this.titleTheme = "Modo Oscuro"
      body.classList.remove('dark-theme');
    }
  }
}
