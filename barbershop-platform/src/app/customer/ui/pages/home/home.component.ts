import { Component, OnInit } from '@angular/core';
import { InfoBarbershopComponent } from '../../components/info-barbershop/info-barbershop.component';
import { CarouselIndicatorsComponent } from '../../components/carousel-indicators/carousel-indicators.component';
import { AboutBarberComponent } from '../../components/about-barber/about-barber.component';
import { DirectionMapsComponent } from '../../components/direction-maps/direction-maps.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InfoBarbershopComponent, CarouselIndicatorsComponent,
    DirectionMapsComponent, AboutBarberComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor() {

  }
  ngOnInit(): void {
  }
}
