import { Component } from '@angular/core';
import { InfoBarbershopComponent } from '../../components/info-barbershop/info-barbershop.component';
import { CarouselIndicatorsComponent } from '../../components/carousel-indicators/carousel-indicators.component';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [InfoBarbershopComponent,CarouselIndicatorsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
