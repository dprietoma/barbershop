import { Component, OnInit } from '@angular/core';
import { InfoBarbershopComponent } from '../../components/info-barbershop/info-barbershop.component';
import { CarouselIndicatorsComponent } from '../../components/carousel-indicators/carousel-indicators.component';
import { AboutBarberComponent } from '../../components/about-barber/about-barber.component';
import { DirectionMapsComponent } from '../../components/direction-maps/direction-maps.component';
import { RouteHistoryService } from '../../utils/global/route-history.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InfoBarbershopComponent, CarouselIndicatorsComponent,
    DirectionMapsComponent, AboutBarberComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private routeHistory: RouteHistoryService) {

  }
  ngOnInit(): void {
    const previous = this.routeHistory.getPreviousUrl();
    if (previous === '/appointment-confirmed') {
      history.pushState(null, '', location.href);
      window.onpopstate = () => {
        history.pushState(null, '', location.href);
      };
    }

  }
}
