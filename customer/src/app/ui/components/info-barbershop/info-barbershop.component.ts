import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-info-barbershop',
  standalone: true,
  imports: [],
  templateUrl: './info-barbershop.component.html',
  styleUrl: './info-barbershop.component.css'
})
export class InfoBarbershopComponent {
  constructor(private route: Router) {

  }
  navigateToServices() {
    this.route.navigate(['/services']);
  }
}
