import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBarberComponent } from './about-barber.component';

describe('AboutBarberComponent', () => {
  let component: AboutBarberComponent;
  let fixture: ComponentFixture<AboutBarberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutBarberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutBarberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
