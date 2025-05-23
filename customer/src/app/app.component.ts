import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './ui/shared/spinner/spinner.component';

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

  ngOnInit() {
    this.loadTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const body = document.body;
    if (this.isDarkMode) {
      this.titleTheme = "Modo Claro";
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', 'dark');
      }
    } else {
      this.titleTheme = "Modo Oscuro";
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', 'light');
      }
    }
  }

  loadTheme() {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
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


