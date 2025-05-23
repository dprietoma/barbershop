import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-location',
  standalone: true, 
  imports: [],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  

  constructor(private router: Router){}
  navigateToHome(){
    this.router.navigate(['/home']);
  }
}
