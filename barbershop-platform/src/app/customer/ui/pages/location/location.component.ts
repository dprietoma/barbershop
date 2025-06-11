import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import {FooterComponent} from '../../../../shared/footer/footer.component';


@Component({
  selector: 'app-location',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {


  constructor(private router: Router, private sessionStorage: SessionStorageService) {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/_flush');
      window.history.replaceState({}, '', '/');
    }
  }
  navigateToHome(type: string) {
    this.sessionStorage.saveType('mode', type);
    this.router.navigate(['/customer/home']);
  }
}
