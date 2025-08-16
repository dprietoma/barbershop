import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Users } from '../interface/users-interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-buttons',
  imports: [CommonModule],
  templateUrl: './nav-buttons.component.html',
  styleUrl: './nav-buttons.component.css'
})
export class NavButtonsComponent {
  @Input() isDarkMode!: boolean;
  @Input() information!: any;
  @Output() themeToggle = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Input() isInNavbar = false;
  @Input() user!: Users | null;
  constructor(private route: Router) {

  }

  redirect(): void {
    this.route.navigate(['/admin/custom']);
  }

}
