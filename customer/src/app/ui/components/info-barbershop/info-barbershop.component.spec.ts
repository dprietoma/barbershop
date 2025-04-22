import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBarbershopComponent } from './info-barbershop.component';

describe('InfoBarbershopComponent', () => {
  let component: InfoBarbershopComponent;
  let fixture: ComponentFixture<InfoBarbershopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBarbershopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoBarbershopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
