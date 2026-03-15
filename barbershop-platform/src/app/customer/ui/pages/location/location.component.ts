import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { FooterComponent } from '../../../../shared/footer/footer.component';


@Component({
  selector: 'app-location',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit {


  constructor(private router: Router, private sessionStorage: SessionStorageService) { }
  ngOnInit(): void {
    const response = sessionStorage.getItem('close') === 'YES';
    if (response) {
      sessionStorage.removeItem('close');
      window.location.reload();
    }
  }
  navigateToHome(type: string) {
    this.sessionStorage.saveType('mode', type);
    this.router.navigate(['/customer/home']);
  }
}
